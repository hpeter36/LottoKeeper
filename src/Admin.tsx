import React, { useState, useRef, useContext } from "react";
import {
  AppContext,
  TicketData,
  DrawData,
  LotteryNumbers,
} from "./ContextProvider";
import DataTable, { DataTableData } from "./DataTable";
import { getRangeArrWithLen } from "./helpers";
import SelectDropDown from "./SelectDropDown";

const Admin = () => {
  const [infoText, setInfoText] = useState("");
  const [selectedClosedRoundId, setSelectedClosedRoundId] = useState("");
  const [actualDrawNumbers, setActualDrawNumbers] = useState<
    number[] | undefined
  >(undefined);
  const inputRefTicketCount = useRef<HTMLInputElement>(null);

  const {
    playerData,
    setPlayerData,
    adminData,
    setAdminData,
    tickets,
    setTickets,
    draws,
    setDraws,
    lotteryMeta,
    resetGame,
  } = useContext(AppContext);

  // sent tickets table
  const actualRoundId = draws.find((draw) => draw.numbers === undefined)?.id;
  const sentTicketsForActualRoundDescending = tickets
    .filter((d) => d.drawID === actualRoundId)
    .sort((a, b) => b.player.localeCompare(a.player));
  const tableData: DataTableData = {
    tableHeader: `Sent tickets for actual round(#${actualRoundId})`,
    tableId: "tickets_table_act_",
    tableColumnsData: [
      {
        headerName: "Created date",
        sortable: false,
        values: sentTicketsForActualRoundDescending.map((d) =>
          d.date.toISOString()
        ),
      },
      {
        headerName: "Player",
        sortable: false,
        values: sentTicketsForActualRoundDescending.map((d) => d.player),
      },
      {
        headerName: "Ticket numbers",
        sortable: false,
        values: sentTicketsForActualRoundDescending.map((d) =>
          d.numbers.join(" ")
        ),
      },
    ],
  };

  const getSelectedClosedRoundData = (closedDrawId: string) => {
    // last closed round data
    const prevRoundId = Number(closedDrawId);
    const prevRoundData = draws.find((d) => d.id === prevRoundId);
    const ticketsForPrevRound = tickets
      .filter((d) => d.drawID === prevRoundId)
      .sort((d1, d2) => d1.date.getTime() - d2.date.getTime());
    const tableDataPrevRound: DataTableData = {
      tableHeader: "Tickets for previous round",
      tableId: "tickets_table_closed_",
      tableColumnsData: [
        {
          headerName: "Created date",
          sortable: true,
          values: ticketsForPrevRound.map((d) => d.date.toISOString()),
        },
        {
          headerName: "Player",
          sortable: true,
          values: ticketsForPrevRound.map((d) => d.player),
        },
        {
          headerName: "Ticket numbers",
          sortable: true,
          values: ticketsForPrevRound.map((d) => d.numbers.join(" ")),
          formatData: (dataElement: any) => {
            const splitted = dataElement.split(" ");
            return splitted.map((myNum: number) =>
              prevRoundData!.numbers?.indexOf(Number(myNum)) !== -1 ? (
                <span>
                  <b>{myNum}</b>{" "}
                </span>
              ) : (
                <span>{myNum} </span>
              )
            );
          },
        },
        {
          headerName: "Drawn numbers",
          sortable: true,
          values: getRangeArrWithLen(ticketsForPrevRound.length).map((d) =>
            prevRoundData!.numbers!.join(" ")
          ),
        },
        {
          headerName: "Match count",
          sortable: true,
          values: ticketsForPrevRound.map((d) => d.hits!),
        },
        {
          headerName: "Reward",
          sortable: true,
          values: ticketsForPrevRound.map((d) => d.reward),
        },
      ],
    };

    return tableDataPrevRound
  };

  // closed round ids for select box
  const closedRounds = draws.filter((draw) => draw.id !== actualRoundId);

  // selected closed round data for table
  const ticketsForClosedRound = getSelectedClosedRoundData(
    selectedClosedRoundId
  );

  // summary for all rounds
  const closedTickets = tickets.filter((d) => d.drawID !== actualRoundId!);
  const countBellow2Hit = closedTickets.filter((d) => d.hits! < 2).length;
  const _2hits = closedTickets.filter((d) => d.hits === 2);
  const _3hits = closedTickets.filter((d) => d.hits === 3);
  const _4hits = closedTickets.filter((d) => d.hits === 4);
  const _5hits = closedTickets.filter((d) => d.hits === 5);
  const sumPayment2Hits = _2hits
    .map((d) => d.reward)
    .reduce((acc, currVal) => acc + currVal, 0);
  const sumPayment3Hits = _3hits
    .map((d) => d.reward)
    .reduce((acc, currVal) => acc + currVal, 0);
  const sumPayment4Hits = _4hits
    .map((d) => d.reward)
    .reduce((acc, currVal) => acc + currVal, 0);
  const sumPayment5Hits = _5hits
    .map((d) => d.reward)
    .reduce((acc, currVal) => acc + currVal, 0);
  const sumPayments =
    sumPayment2Hits + sumPayment3Hits + sumPayment4Hits + sumPayment5Hits;
  const sumRevenue = closedTickets.length * lotteryMeta.ticketPrice;

  const tableDataSummary: DataTableData = {
    tableHeader: "Summary for all closed rounds",
    tableId: "tickets_table_summary",
    tableColumnsData: [
      {
        headerName: "Metric",
        sortable: false,
        values: [
          "tickets count",
          "Below 2 hits",
          "2 hits count",
          "3 hits count",
          "4 hits count",
          "5 hits count",
          "payment for 2 hits",
          "payment for 3 hits",
          "payment for 4 hits",
          "payment for 5 hits",
          "2 hits sum payment",
          "3 hits sum payment",
          "4 hits sum payment",
          "5 hits sum payment",
          "Sum revenue",
          "Sum payment",
          "Net profit",
        ],
      },
      {
        headerName: "Value",
        sortable: false,
        values: [
          closedTickets.length,
          countBellow2Hit,
          _2hits.length,
          _3hits.length,
          _4hits.length,
          _5hits.length,
          lotteryMeta.rewards.find((r) => r.count === 2)?.value!,
          lotteryMeta.rewards.find((r) => r.count === 3)?.value!,
          lotteryMeta.rewards.find((r) => r.count === 4)?.value!,
          lotteryMeta.rewards.find((r) => r.count === 5)?.value!,
          sumPayment2Hits,
          sumPayment3Hits,
          sumPayment4Hits,
          sumPayment5Hits,
          sumRevenue,
          sumPayments,
          sumRevenue - sumPayments,
        ],
      },
    ],
  };

  const drawNumbers = () => {
    const drawnNumbers = [];
    while (drawnNumbers.length < 5) {
      const n =
        Math.floor(Math.random() * (lotteryMeta.totalNumberCount - 1 + 1)) + 1;
      if (drawnNumbers.indexOf(n) === -1) drawnNumbers.push(n);
    }
    return drawnNumbers as LotteryNumbers;
  };

  const doDraw = () => {
    // draw new numbers
    const numbersDrawn = drawNumbers();
    setActualDrawNumbers(numbersDrawn);

    // actual draw -> set numbers
    let actDrawID = -1;
    const newDraws: DrawData[] = draws.map((d) => {
      if (d.numbers) return d;

      actDrawID = d.id;

      return { ...d, numbers: numbersDrawn };
    });

    // set new round
    newDraws.push({ id: newDraws.length, numbers: undefined });
    setDraws!(newDraws);

    // set all tickets result for actual draw
    const newTickets: TicketData[] = tickets.map((t) => {
      // calculate only for unfinished tickets
      if (t.hits) return t;

      // check for hit count
      const numberHits = t.numbers.filter(
        (n) => numbersDrawn.indexOf(n) !== -1
      );

      // calc. reward
      const reward = lotteryMeta.rewards.find(
        (r) => r.count === numberHits.length
      )?.value!;
      return {
        ...t,
        numbersHit: numberHits,
        hits: numberHits.length,
        reward: reward,
      };
    });
    setTickets!(newTickets);

    // account player balance
    const playerSumRewards = newTickets
      .filter((d) => d.player === "Player" && d.drawID === actDrawID)
      .map((d) => d.reward)
      .reduce((acc, currVal) => acc + currVal, 0);
    setPlayerData!({
      ...playerData,
      balance: playerData.balance + playerSumRewards,
    });

    const generatedSumRewards = newTickets
      .filter((d) => d.player === "Generated" && d.drawID === actDrawID)
      .map((d) => d.reward)
      .reduce((acc, currVal) => acc + currVal, 0);

    // account admin
    setAdminData!({
      ...adminData,
      balance: adminData.balance - playerSumRewards - generatedSumRewards,
    });
  };

  const generateTickets = () => {
    const ticketCount = Number(inputRefTicketCount.current!.value);
    const generatedTickets: TicketData[] = [];
    for (let i = 0; i < ticketCount; i++) {
      const drawnNumbers = drawNumbers();

      const drawId = draws.find((d) => !d.numbers)!.id;
      const ticket: TicketData = {
        id: tickets.length,
        date: new Date(),
        drawID: drawId,
        player: "Generated",
        numbers: drawnNumbers,
        hits: undefined,
        numbersHit: undefined,
        reward: 0,
      };
      generatedTickets.push(ticket);
    }

    setTickets!([...tickets, ...generatedTickets]);

    setAdminData!({
      ...adminData,
      balance: adminData.balance + ticketCount * lotteryMeta.ticketPrice,
    });

    setInfoText(`${ticketCount} new tickets were generated`);

  };

  const resetGameEvent = () => {
    if (
      !confirm(
        "Are you sure you want to reset game?(all stored data will be lost!)"
      )
    )
      return;

    resetGame!();

    setInfoText("Game has been reset successfully, all data were restored to default values")

  };

  const selectedClosedRoundChanged = (selected: string) => {
    setSelectedClosedRoundId(selected);
  };

  return (
    <div className="min-h-screen">
      {/* admin meta  */}
      <div className="flex">
        <div className="p-5 grow">
          Balance: <span>{`${adminData.balance} akcse`}</span>
        </div>
      </div>
      {/* feedback, info panel */}
      <div className="p-5 text-center">{infoText}</div>

      {/* draw actual turn, new round */}
      <div className="flex items-center justify-center py-5">
        <button className="bg-slate-200" onClick={doDraw}>
          {`Draw actual round (#${actualRoundId})`}
        </button>
      </div>

      {/* show drawn numbers */}
      <div className="flex items-center justify-center py-5">
        <span>{actualDrawNumbers?.join(" ")}</span>
      </div>

      {/* <div className="flex py-5">
        <button className="bg-slate-200">Start new round</button>
      </div> */}

      {/* simulate tickets */}
      <div>
        <form>
          <label htmlFor="generatetickets">Generate tickets:</label>
          <input
            ref={inputRefTicketCount}
            type="number"
            id="generatetickets"
            name="generatetickets"
            placeholder="Enter the count you want to generate"
            required
          ></input>
          <input type="button" value="Generate" onClick={generateTickets} />
        </form>
      </div>

      {/* tables side by side */}
      <div>
        <DataTable {...tableData} />
        <SelectDropDown
          options={closedRounds.map((d) => String(d.id))}
          selectEvent={selectedClosedRoundChanged}
        />
        <DataTable {...ticketsForClosedRound} />
        <DataTable {...tableDataSummary} />
      </div>

      {/* reset game button */}
      <div>
        <input
          className="p-3 bg-slate-200"
          type="button"
          value="Reset game(clear all data)"
          onClick={resetGameEvent}
        />
      </div>
    </div>
  );
};

export default Admin;
