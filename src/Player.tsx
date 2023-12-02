import React, { useContext, useEffect, useRef } from "react";
import { AppContext } from "./ContextProvider";
import LotteryTable from "./LotteryTable";
import SentTicketsTable from "./SentTicketsTable";

const Player = () => {
  const { playerData, setPlayerData, tickets, infoText } = useContext(AppContext);

  const nameInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className=" min-h-screen">
      {!playerData.name ? (
        <form>
          <label htmlFor="playername">Player name:</label>
          <input
          ref={nameInputRef}
            type="text"
            id="playername"
            name="playername"
            placeholder="Enter your name"
            required
          ></input>
          <input type="button" value="Enter" onClick={() => setPlayerData!((prev) => {return {...prev, name: nameInputRef.current!.value }})} />
        </form>
      ) : (
        <div>
          {/* main player screen */}
          {/* header */}
          <div className="flex">
            <div className="grow p-5">
              Name: <span>{playerData.name}</span>
            </div>
            <div className="grow p-5">
              Balance: <span>{`${playerData.balance} akcse`}</span>
            </div>
            <div className="grow p-5">
              Tickets sent:{" "}
              <span>{tickets.filter((d) => d.player === "Player").length}</span>
            </div>
          </div>
          {/* feedback, info panel */}
          <div className="text-center p-5">{infoText}</div>

          {/* main data */}
          <div className="">
            <LotteryTable />
            <SentTicketsTable ticketData={tickets} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
