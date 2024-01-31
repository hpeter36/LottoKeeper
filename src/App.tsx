import { useState } from "react";
import "./App.css";

import ContextProvider from "./ContextProvider";
import Player from "./Player";
import Admin from "./Admin";

function App() {
  const [playerActive, setPlayerActive] = useState(true);

  return (
    <ContextProvider>
      <div className="w-full h-full">
        {/* switch between player, admin */}
        <div className="flex">
          <div
            className="p-5 text-xl text-center bg-green-500 grow hover:bg-green-700 hover:text-white"
            onClick={() => setPlayerActive(true)}
          >
            Player
          </div>
          <div
            className="p-5 text-xl text-center bg-green-500 grow hover:bg-green-700 hover:text-white"
            onClick={() => setPlayerActive(false)}
          >
            Admin
          </div>
        </div>
        {playerActive ? <Player /> : <Admin />}
      </div>
    </ContextProvider>
  );
}

export default App;
