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
import NotifyText from "./NotifyText";
import DrawnNumbers from "./DrawnNumbers";

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
        values: sentTicketsForActualRoundDescending.map((d, i) => {
          return { id: `ar_cd_${i}`, value: d.date.toISOString() };
        }),
      },
      {
        headerName: "Player",
        sortable: false,
        values: sentTicketsForActualRoundDescending.map((d, i) => {
          return { id: `ar_pl_${i}`, value: d.player };
        }),
      },
      {
        headerName: "Ticket numbers",
        sortable: false,
        values: sentTicketsForActualRoundDescending.map((d, i) => {
          return { id: `ar_tn_${i}`, value: d.numbers.join(" ") };
        }),
      },
    ],
  };

  const getSelectedClosedRoundData = (closedDrawId: string) => {
    // last closed round data
    const prevRoundId = Number(closedDrawId);
    const prevRoundData = draws.find((d) => d.id === prevRoundId);

    // get tickets for closed round
    let ticketsForPrevRound = tickets
      .filter((d) => d.drawID === prevRoundId)
      .sort((d1, d2) => d1.date.getTime() - d2.date.getTime());

    if (closedDrawId === "") ticketsForPrevRound = [];

    const tableDataPrevRound: DataTableData = {
      tableHeader: "Tickets for previous round",
      tableId: "tickets_table_closed_a_",
      tableColumnsData: [
        {
          headerName: "Created date",
          sortable: true,
          values: ticketsForPrevRound.map((d, i) => {
            return { id: `pr_cd_${i}`, value: d.date.toISOString() };
          }),
        },
        {
          headerName: "Player",
          sortable: true,
          values: ticketsForPrevRound.map((d, i) => {
            return { id: `pr_pl_${i}`, value: d.player };
          }),
        },
        {
          headerName: "Ticket numbers",
          sortable: true,
          values: ticketsForPrevRound.map((d, i) => {
            return { id: `pr_tn_${i}`, value: d.numbers.join(" ") };
          }),
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
          values: getRangeArrWithLen(ticketsForPrevRound.length).map((d, i) => {
            return { id: `pr_dn_${i}`, value: prevRoundData!.numbers!.join(" ") };
          }),
        },
        {
          headerName: "Match count",
          sortable: true,
          values: ticketsForPrevRound.map((d, i) => {
            return { id: `pr_mc_${i}`, value: d.hits! };
          }),
        },
        {
          headerName: "Reward",
          sortable: true,
          values: ticketsForPrevRound.map((d, i) => {
            return { id: `pr_rd_${i}`, value: d.reward };
          }),
        },
      ],
    };

    return tableDataPrevRound;
  };

  // closed round ids for select box
  const closedRounds = draws.filter((draw) => draw.id !== actualRoundId);

  if (selectedClosedRoundId == "" && closedRounds.length > 0)
    setSelectedClosedRoundId(closedRounds[0].id.toString());

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
          { id: `mc_${0}`, value: "tickets count" },
          { id: `mc_${1}`, value: "Below 2 hits" },
          { id: `mc_${2}`, value: "2 hits count" },
          { id: `mc_${3}`, value: "3 hits count" },
          { id: `mc_${4}`, value: "4 hits count" },
          { id: `mc_${5}`, value: "5 hits count" },
          { id: `mc_${6}`, value: "payment for 2 hits" },
          { id: `mc_${7}`, value: "payment for 3 hits" },
          { id: `mc_${8}`, value: "payment for 4 hits" },
          { id: `mc_${9}`, value: "payment for 5 hits" },
          { id: `mc_${10}`, value: "2 hits sum payment" },
          { id: `mc_${11}`, value: "3 hits sum payment" },
          { id: `mc_${12}`, value: "4 hits sum payment" },
          { id: `mc_${13}`, value: "5 hits sum payment" },
          { id: `mc_${14}`, value: "Sum revenue" },
          { id: `mc_${15}`, value: "Sum payment" },
          { id: `mc_${16}`, value: "Net profit" },
        ],
      },
      {
        headerName: "Value",
        sortable: false,
        values: [
          { id: `v_${0}`, value: closedTickets.length },
          { id: `v_${1}`, value: countBellow2Hit },
          { id: `v_${2}`, value: _2hits.length },
          { id: `v_${3}`, value: _3hits.length },
          { id: `v_${4}`, value: _4hits.length },
          { id: `v_${5}`, value: _5hits.length },
          {
            id: `v_${6}`,
            value: lotteryMeta.rewards.find((r) => r.count === 2)?.value!,
          },
          {
            id: `v_${7}`,
            value: lotteryMeta.rewards.find((r) => r.count === 3)?.value!,
          },
          {
            id: `v_${8}`,
            value: lotteryMeta.rewards.find((r) => r.count === 4)?.value!,
          },
          {
            id: `v_${9}`,
            value: lotteryMeta.rewards.find((r) => r.count === 5)?.value!,
          },
          { id: `v_${10}`, value: sumPayment2Hits },
          { id: `v_${11}`, value: sumPayment3Hits },
          { id: `v_${12}`, value: sumPayment4Hits },
          { id: `v_${13}`, value: sumPayment5Hits },
          { id: `v_${14}`, value: sumRevenue },
          { id: `v_${15}`, value: sumPayments },
          { id: `v_${16}`, value: sumRevenue - sumPayments },
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

    setInfoText(
      "Game has been reset successfully, all data were restored to default values"
    );
  };

  const selectedClosedRoundChanged = (selected: string) => {
    setSelectedClosedRoundId(selected);
  };

  return (
    <div className="min-h-screen">
      {/* admin meta  */}
      <div className="flex">
        <div className="py-5 font-bold grow">
          Balance: <span>{`${adminData.balance} akcse`}</span>
        </div>
      </div>

      {/* feedback, info panel */}
      <div className="flex items-center justify-center py-5">
        <NotifyText text={infoText} />
      </div>

      {/* draw actual turn, new round */}
      <div className="flex items-center justify-center py-5">
        <button
          className="text-xl bg-green-500 hover:bg-green-700 hover:text-white"
          onClick={doDraw}
        >
          {`Draw actual round (#${actualRoundId})`}
        </button>
      </div>

      {/* show drawn numbers */}
      <DrawnNumbers actualDrawNumbers={actualDrawNumbers} />

      {/* <div className="flex py-5">
        <button className="bg-slate-200">Start new round</button>
      </div> */}

      {/* simulate tickets */}
      <div>
        <div className="mb-3">
          <label className="text-xl font-bold" htmlFor="generatetickets">
            Generate tickets
          </label>
        </div>
        <div>
          <input
            className="w-[270px] px-3 py-2 text-lg text-gray-700 shadow focus:outline-none focus:shadow-outline"
            ref={inputRefTicketCount}
            type="number"
            id="generatetickets"
            name="generatetickets"
            placeholder="Enter the count you want to"
            required
          ></input>
          <input
            className="px-2 py-2 text-lg bg-green-500 rounded-r-lg hover:bg-green-700 hover:text-white"
            type="button"
            value="Generate"
            onClick={generateTickets}
          />
        </div>
      </div>

      {/* tables side by side */}
      <div>
        <DataTable {...tableData} />
        <SelectDropDown
          id="select_closed_round"
          label="Select the closed round id"
          options={closedRounds.map((d) => String(d.id))}
          selectEvent={selectedClosedRoundChanged}
        />
        <DataTable {...ticketsForClosedRound} />
        <DataTable {...tableDataSummary} />
      </div>

      {/* reset game button */}
      <div>
        <input
          className="p-3 bg-green-500 hover:bg-green-700 hover:text-white"
          type="button"
          value="Reset game(clear all data)"
          onClick={resetGameEvent}
        />
      </div>
    </div>
  );
};

export default Admin;
