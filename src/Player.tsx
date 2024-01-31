import React, { useContext, useState, useRef } from "react";
import { AppContext } from "./ContextProvider";
import LotteryTable from "./LotteryTable";
import DataTable, { DataTableData } from "./DataTable";
import SelectDropDown from "./SelectDropDown";
import { formatDate } from "./helpers";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import NotifyText from "./NotifyText";

const Player = () => {
  const [infoText, setInfoText] = useState("Select 5 numbers to send a ticket");
  const [selectedClosedRoundId, setSelectedClosedRoundId] = useState("");

  const { playerData, setPlayerData, tickets, draws } = useContext(AppContext);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const getSelectedClosedRoundData = (closedDrawId: string) => {
    let ticketsForClosedRound = tickets
      .filter((d) => d.player === "Player" && d.drawID === Number(closedDrawId))
      .sort((d1, d2) => d1.date.getTime() - d2.date.getTime());

    if (closedDrawId === "") ticketsForClosedRound = [];

    const tableDataPrevRound: DataTableData = {
      tableHeader: "Tickets for previous round",
      tableId: "tickets_table_closed_p_",
      tableColumnsData: [
        {
          headerName: "Ticket numbers",
          sortable: false,
          values: ticketsForClosedRound.map((d,i) => { return { id: `tn_${i}`, value: d.numbers.join(" ")}}),
        },
        {
          headerName: "Match count",
          sortable: true,
          values: ticketsForClosedRound.map((d,i) => { return { id: `mc_${i}`, value: d.hits!}}),
        },
        {
          headerName: "Reward",
          sortable: false,
          values: ticketsForClosedRound.map((d,i) => {  return { id: `rd_${i}`, value: d.reward}}),
        },
      ],
    };

    return tableDataPrevRound;
  };

  const getActualRoundData = (actualRoundId: number) => {
    // sent tickets for actual round data
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
          values: sentTicketsForActualRound.map((d,i) => { return { id: `cd_${i}`, value: d.date}}),
          formatData: (dataElement: any) => (
            <span>{formatDate(dataElement)}</span>
          ),
        },
        {
          headerName: "Ticket numbers",
          sortable: false,
          values: sentTicketsForActualRound.map((d, i) => {  return { id: `tn_${i}`, value: d.numbers.join(" ")}}),
        },
      ],
    };

    return tableData;
  };

  const actualRoundId = draws.find((draw) => draw.numbers === undefined)?.id;

  // closed round ids for select box
  const closedRounds = draws.filter((draw) => draw.id !== actualRoundId);

  if (selectedClosedRoundId == "" && closedRounds.length > 0)
    setSelectedClosedRoundId(closedRounds[0].id.toString());

  // actual round table data
  const tableDataActualRound = getActualRoundData(actualRoundId!);

  // selected closed round data for table
  const tableDataticketsForClosedRound = getSelectedClosedRoundData(
    selectedClosedRoundId
  );

  // for calculating sum reward
  const ticketsForClosedRound = tickets.filter(
    (d) => d.player === "Player" && d.drawID !== actualRoundId
  );

  // closed round select box
  const selectedClosedRoundChanged = (selected: string) => {
    setSelectedClosedRoundId(selected);
  };

  // handle set info text event
  const setInfoTextEvent = (text: string) => {
    setInfoText(text);
  };

  return (
    <div className="min-h-screen ">
      {/* player name input */}
      {!playerData.name ? (
        <div className="flex items-center justify-center">
          <label
            htmlFor="playername"
            className="p-2 text-xl font-bold text-gray-700 whitespace-nowrap"
          >
            Player name:
          </label>
          <input
            className="w-3/4 px-3 py-2 mx-5 text-xl text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
            ref={nameInputRef}
            type="text"
            id="playername"
            name="playername"
            placeholder="Enter your name"
            required
            onKeyDown={(e) =>
              e.key === "Enter" &&
              setPlayerData!((prev) => {
                return { ...prev, name: nameInputRef.current!.value };
              })
            }
          ></input>
          <input
            className="px-4 py-2 text-xl font-bold bg-green-500 rounded hover:bg-green-700 hover:text-white text-slate-100 focus:outline-none focus:shadow-outline"
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
          <div className="flex my-3 bg-green-500 border rounded-md text-slate-100">
            <div className="p-5 grow">
              Name: <span>{playerData.name}</span>
            </div>
            <div className="p-5 border-l-2 border-green-700 grow">
              Balance: <span>{`${playerData.balance} akcse`}</span>
            </div>
            <div className="p-5 border-l-2 border-green-700 grow">
              Tickets sent:{" "}
              <span>{tickets.filter((d) => d.player === "Player").length}</span>
            </div>
          </div>
          {/* feedback, info panel */}
          <div className="flex items-center justify-center py-5">
            <NotifyText text={infoText} />
          </div>

          <div className="">
            {/* lottery table */}
            <LotteryTable setInfoText={setInfoTextEvent} />

            <div className="flex flex-col items-center justify-center gap-10 my-10 lg:flex-row">

              {/* actual round table */}
              <div className="mt-[24px]">
                <DataTable {...tableDataActualRound} />
              </div>

              {/* closed round table */}
              <div>
                <div>
                <SelectDropDown
                  id="select_closed_round"
                  label="Select the closed round id"
                  options={closedRounds.map((d) => String(d.id))}
                  selectEvent={selectedClosedRoundChanged}
                /></div>
                <DataTable {...tableDataticketsForClosedRound} />
                {/* sum rewards row */}
                <div className="">
                  <span className="font-semibold grow-0">Sum Rewards:</span>
                  <span className="px-10 text-lg font-bold text-center grow">
                    {`${ticketsForClosedRound
                      .map((d) => d.reward)
                      .reduce((acc, currVal) => acc + currVal, 0)} akcse`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
