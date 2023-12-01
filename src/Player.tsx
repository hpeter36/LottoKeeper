import React, {useContext} from "react";
import { AppContext } from "./ContextProvider";
import LotteryTable from "./LotteryTable";
import SentTicketsTable from "./SentTicketsTable";

const Player = () => {

  const {playerData, tickets} = useContext(AppContext)

  return (
    <div className=" min-h-screen">
      {/* header */}
      <div className="flex">
        <div className="grow p-5">
          Name: <span>{playerData.name}</span>
        </div>
        <div className="grow p-5">
          Balance: <span>{`${playerData.balance} akcse`}</span>
        </div>
        <div className="grow p-5">
          Tickets sent: <span>{tickets.filter((d) => d.player === "Player").length}</span>
        </div>
      </div>
      {/* feedback, info panel */}
      <div className="text-center p-5">info to show</div>

      {/* main data */}
      <div className="">
        <LotteryTable />
        <SentTicketsTable />
      </div>
    </div>
  );
};

export default Player;
