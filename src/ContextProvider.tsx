import React, { useState, useEffect, createContext } from "react";

type PlayerData = {
  name: string | undefined;
  balance: number;
};

type AdminData = {
  balance: number;
};

export type TicketData = {
  id: number;
  date: Date;
  drawID: number;
  player: string;
  numbers: [number, number, number, number, number];
  hits: number | undefined;
  reward: number;
};

type LotteryRewardData = {
  count: number;
  value: number;
};

type DrawData = {
  id: number;
  numbers: [number, number, number, number, number] | undefined;
};

type AppData = {
  playerData: PlayerData;
  adminData: AdminData;
  lotteryMeta: {
    rewards: LotteryRewardData[];
  };
  tickets: TicketData[];
  draws: DrawData[];
};

type ContextData = {
  playerData: PlayerData;
  setPlayerData: React.Dispatch<React.SetStateAction<PlayerData>> | undefined;
  adminData: AdminData;
  setAdminData: React.Dispatch<React.SetStateAction<AdminData>> | undefined;
  lotteryMeta: {
    rewards: LotteryRewardData[];
  };
  tickets: TicketData[];
  setTickets: React.Dispatch<React.SetStateAction<TicketData[]>> | undefined;
  draws: DrawData[];
  setDraws: React.Dispatch<React.SetStateAction<DrawData[]>> | undefined;
  infoText: string;
  setInfoText: React.Dispatch<React.SetStateAction<string>> | undefined;
};

const appData: AppData = {
  playerData: { name: undefined, balance: 10000 },
  adminData: { balance: 0 },
  lotteryMeta: {
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
  playerData: appData.playerData,
  setPlayerData: undefined,
  adminData: appData.adminData,
  setAdminData: undefined,
  lotteryMeta: appData.lotteryMeta,
  tickets: appData.tickets,
  setTickets: undefined,
  draws: appData.draws,
  setDraws: undefined,
  infoText: "",
  setInfoText: undefined,
});

const ContextProvider = ({ children }: React.PropsWithChildren) => {
  
// ha a generic nem megy
// const InitAndLoadPlayerData = () => {
//     const data = window.localStorage.getItem("playerData");
//     if (!data) {
//       window.localStorage.setItem(
//         "playerData",
//         JSON.stringify(appData.playerData)
//       );
//       return appData.playerData;
//     } else return JSON.parse(data) as PlayerData;
//   };

  function getInitialContextDataAtKey(k: string)
  {
	switch(k)
	{
		case "playerData":
			return appData.playerData
		case "adminData":
			return appData.adminData
		case "tickets":
			return appData.tickets
		case "draws":
			return appData.draws

	}
  }

  function InitAndLoadPlayerData2<T>(k: string) // key - type name must match
  {
    const data = window.localStorage.getItem(k);

	// no data in local storage, save initial and return
    if (!data) {
	  const initialData = getInitialContextDataAtKey(k) as T;
      window.localStorage.setItem(
        k,
        JSON.stringify(initialData)
      );
      return initialData;
    } 
	// return stored data from local storage
	else return JSON.parse(data) as T;
  };


  const [playerData, setPlayerData] = useState(InitAndLoadPlayerData2<PlayerData>("playerData"));
  const [adminData, setAdminData] = useState(InitAndLoadPlayerData2<AdminData>("adminData"));
  const [lotteryMeta, setLotteryMeta] = useState(appData.lotteryMeta);
  const [tickets, setTickets] = useState(InitAndLoadPlayerData2<TicketData[]>("tickets"));
  const [draws, setDraws] = useState(InitAndLoadPlayerData2<DrawData[]>("draws"));
  const [infoText, setInfoText] = useState("");

  useEffect(() => {
    
  }, []);

  // update localstorage on value changes
  useEffect(() => {
	localStorage.setItem("playerData", JSON.stringify(playerData))
  },[playerData])
  useEffect(() => {
	localStorage.setItem("adminData", JSON.stringify(adminData))
  },[adminData])
  useEffect(() => {
	localStorage.setItem("tickets", JSON.stringify(tickets))
  },[tickets])
  useEffect(() => {
	localStorage.setItem("draws", JSON.stringify(draws))
  },[draws])

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
        infoText,
        setInfoText,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
