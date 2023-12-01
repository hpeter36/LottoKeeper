import { useState } from "react";
import "./App.css";

import ContextProvider from "./ContextProvider";
import Player from "./Player";
import Admin from "./Admin";

function App() {
  const [playerActive, setPlayerActive] = useState(true);

  // localstorage kiolv initkor

  return (
    <ContextProvider>
      <div className="w-full h-full">
        {/* switch between player, admin */}
        <div className="flex">
          <div
            className="grow text-center p-5"
            onClick={() => setPlayerActive(true)}
          >
            Player
          </div>
          <div
            className="grow text-center p-5"
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
