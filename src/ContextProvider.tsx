import React, { useState, createContext } from "react";

type PlayerData = {
  name: string | undefined;
  balance: number;
};

type AdminData = {
  balance: number;
};

type TicketData = {
  id: number;
  date: Date;
  drawID: number;
  player: string;
  numbers: [number, number, number, number, number];
  hits: number | undefined;
  reward: number | undefined;
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
});

const ContextProvider = ({ children }: React.PropsWithChildren) => {
  const [playerData, setPlayerData] = useState(appData.playerData);
  const [adminData, setAdminData] = useState(appData.adminData);
  const [lotteryMeta, setLotteryMeta] = useState(appData.lotteryMeta);
  const [tickets, setTickets] = useState(appData.tickets);
  const [draws, setDraws] = useState(appData.draws);

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
