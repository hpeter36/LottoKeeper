import React, { useContext, useState, useRef } from "react";
import { AppContext } from "./ContextProvider";
import LotteryTable from "./LotteryTable";
import DataTable, { DataTableData } from "./DataTable";
import SelectDropDown from "./SelectDropDown";

const Player = () => {
  const [infoText, setInfoText] = useState("");
  const [selectedClosedRoundId, setSelectedClosedRoundId] = useState("");

  const { playerData, setPlayerData, tickets, draws } = useContext(AppContext);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const getSelectedClosedRoundData = (closedDrawId: string) => {
    const ticketsForClosedRound = tickets
      .filter((d) => d.player === "Player" && d.drawID === Number(closedDrawId))
      .sort((d1, d2) => d1.date.getTime() - d2.date.getTime());
    const tableDataPrevRound: DataTableData = {
      tableHeader: "Tickets for previous round",
      tableId: "tickets_table_closed_",
      tableColumnsData: [
        {
          headerName: "Ticket numbers",
          sortable: false,
          values: ticketsForClosedRound.map((d) => d.numbers.join(" ")),
        },
        {
          headerName: "Match count",
          sortable: true,
          values: ticketsForClosedRound.map((d) => d.hits!),
        },
        {
          headerName: "Reward",
          sortable: false,
          values: ticketsForClosedRound.map((d) => d.reward),
        },
      ],
    };

    return tableDataPrevRound;
  };

  // sent tickets for actual round data
  const actualRoundId = draws.find((draw) => draw.numbers === undefined)?.id;
  const sentTicketsForActualRound = tickets
    .filter((d) => d.player === "Player" && d.drawID === actualRoundId)
    .sort((d1, d2) => d1.date.getTime() - d2.date.getTime());

  const tableData: DataTableData = {
    tableHeader: `Sent tickets for actual round(#${actualRoundId})`,
    tableId: "tickets_table_act_",
    tableColumnsData: [
      {
        headerName: "Created date",
        sortable: false,
        values: sentTicketsForActualRound.map((d) => d.date.toISOString()),
      },
      {
        headerName: "Ticket numbers",
        sortable: false,
        values: sentTicketsForActualRound.map((d) => d.numbers.join(" ")),
      },
    ],
  };

  // closed round ids for select box
  const closedRounds = draws.filter((draw) => draw.id !== actualRoundId);

  const ticketsForClosedRound = tickets.filter((d) => d.player === "Player" && d.drawID !== actualRoundId)

  // selected closed round data for table
  const tableDataticketsForClosedRound = getSelectedClosedRoundData(
    selectedClosedRoundId
  );

  const selectedClosedRoundChanged = (selected: string) => {
    setSelectedClosedRoundId(selected);
  };

  return (
    <div className="min-h-screen">
      {!playerData.name ? (
        <div>
          <label htmlFor="playername">Player name:</label>
          <input
            ref={nameInputRef}
            type="text"
            id="playername"
            name="playername"
            placeholder="Enter your name"
            required
          ></input>
          <input
            type="button"
            value="Enter"
            onClick={() =>
              setPlayerData!((prev) => {
                return { ...prev, name: nameInputRef.current!.value };
              })
            }
          />
        </div>
      ) : (
        <div>
          {/* main player screen */}
          {/* header */}
          <div className="flex">
            <div className="p-5 grow">
              Name: <span>{playerData.name}</span>
            </div>
            <div className="p-5 grow">
              Balance: <span>{`${playerData.balance} akcse`}</span>
            </div>
            <div className="p-5 grow">
              Tickets sent:{" "}
              <span>{tickets.filter((d) => d.player === "Player").length}</span>
            </div>
          </div>
          {/* feedback, info panel */}
          <div className="p-5 text-center">{infoText}</div>

          {/* main data */}
          <div className="">
            <LotteryTable setInfoText={setInfoText} />
            <DataTable {...tableData} />
            <SelectDropDown
              options={closedRounds.map((d) => String(d.id))}
              selectEvent={selectedClosedRoundChanged}
            />
            <DataTable {...tableDataticketsForClosedRound} />
            <div>
              Sum Rewards: <span>{ticketsForClosedRound.map((d)=>d.reward).reduce((acc, currVal) => acc + currVal, 0)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
