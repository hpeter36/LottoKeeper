import React, { useState, useEffect, createContext } from "react";

type PlayerData = {
  name: string | undefined;
  balance: number;
};

type AdminData = {
  balance: number;
};

export type LotteryNumbers = [number, number, number, number, number];

export type TicketData = {
  id: number;
  date: Date;
  drawID: number;
  player: string;
  numbers: LotteryNumbers;
  numbersHit: number[] | undefined;
  hits: number | undefined;
  reward: number;
};

type LotteryRewardData = {
  count: number;
  value: number;
};

export type DrawData = {
  id: number;
  numbers: LotteryNumbers | undefined;
};

type LotteryMeta = {
  totalNumberCount : number,
  numbersToDraw : number,
  ticketPrice: number,
  rewards: LotteryRewardData[];
}

type AppData = {
  playerData: PlayerData;
  adminData: AdminData;
  lotteryMeta: LotteryMeta;
  tickets: TicketData[];
  draws: DrawData[];
};

type ContextData = {
  playerData: PlayerData;
  setPlayerData: React.Dispatch<React.SetStateAction<PlayerData>> | undefined;
  adminData: AdminData;
  setAdminData: React.Dispatch<React.SetStateAction<AdminData>> | undefined;
  lotteryMeta: LotteryMeta;
  tickets: TicketData[];
  setTickets: React.Dispatch<React.SetStateAction<TicketData[]>> | undefined;
  draws: DrawData[];
  setDraws: React.Dispatch<React.SetStateAction<DrawData[]>> | undefined;
  resetGame: (() => void) | undefined;
};

const appDefaultData: AppData = {
  playerData: { name: undefined, balance: 10000 },
  adminData: { balance: 0 },
  lotteryMeta: {
    totalNumberCount: 39,
    numbersToDraw: 5,
    ticketPrice: 500,
    rewards: [
      { count: 0, value: 0 },
      { count: 1, value: 0 },
      { count: 2, value: 700 },
      { count: 3, value: 1500 },
      { count: 4, value: 4500 },
      { count: 5, value: 10000 },
    ],
  },
  tickets: [],
  draws: [{ id: 0, numbers: undefined }],
};

export const AppContext = createContext<ContextData>({
  playerData: appDefaultData.playerData,
  setPlayerData: undefined,
  adminData: appDefaultData.adminData,
  setAdminData: undefined,
  lotteryMeta: appDefaultData.lotteryMeta,
  tickets: appDefaultData.tickets,
  setTickets: undefined,
  draws: appDefaultData.draws,
  setDraws: undefined,
  resetGame : undefined,
});

const ContextProvider = ({ children }: React.PropsWithChildren) => {
  
  function getInitialContextDataAtKey(k: string) {
    switch (k) {
      case "playerData":
        return appDefaultData.playerData;
      case "adminData":
        return appDefaultData.adminData;
      case "tickets":
        return appDefaultData.tickets;
      case "draws":
        return appDefaultData.draws;
    }
  }

  function InitAndLoadPlayerData2(k: string) {
    // key - type name must match
    const data = window.localStorage.getItem(k);

    // no data in local storage, save initial and return
    if (!data) {
      const initialData = getInitialContextDataAtKey(k);
      window.localStorage.setItem(k, JSON.stringify(initialData));
      return initialData;
    }
    // return stored data from local storage
    else {
      const deserialized = JSON.parse(data);

      // deserializing dates
      if(k === "tickets")
      {
        const ticketDataArr = deserialized as TicketData[];
        return ticketDataArr.map((d) => {return {...d, date: new Date(d.date)}})
      }

      return deserialized;
    }
  }

  const [playerData, setPlayerData] = useState(
    InitAndLoadPlayerData2("playerData")
  );
  const [adminData, setAdminData] = useState(
    InitAndLoadPlayerData2("adminData")
  );
  const [lotteryMeta, setLotteryMeta] = useState(appDefaultData.lotteryMeta);
  const [tickets, setTickets] = useState(
    InitAndLoadPlayerData2("tickets")
  );
  const [draws, setDraws] = useState(
    InitAndLoadPlayerData2("draws")
  );

  // update localstorage on value changes
  useEffect(() => {
    localStorage.setItem("playerData", JSON.stringify(playerData));
  }, [playerData]);
  useEffect(() => {
    localStorage.setItem("adminData", JSON.stringify(adminData));
  }, [adminData]);
  useEffect(() => {
    localStorage.setItem("tickets", JSON.stringify(tickets));
  }, [tickets]);
  useEffect(() => {
    localStorage.setItem("draws", JSON.stringify(draws));
  }, [draws]);

  function resetGame()
  {
    setPlayerData(appDefaultData.playerData)
    setAdminData(appDefaultData.adminData)
    setTickets(appDefaultData.tickets)
    setDraws(appDefaultData.draws)
  }

  return (
    <AppContext.Provider
      value={{
        playerData,
        setPlayerData,
        adminData,
        setAdminData,
        lotteryMeta,
        tickets,
        setTickets,
        draws,
        setDraws,
        resetGame
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
