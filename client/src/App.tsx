import { BrowserRouter, Routes, Route } from "react-router";

import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import JoinLobby from "./pages/lobby/JoinLobby";
import Lobby from "./pages/lobby/Lobby";
import NewGameSolo from "./pages/singleplayer/NewGame";
import LoadGameSolo from "./pages/singleplayer/LoadGame";
import GameBoard from "./pages/game/GameBoard";

function App() {
    const title = "Star Wars Villainous";
    const imagePath = "../../logo.jpg";

    return (
        <BrowserRouter>
            <Header title={title} imagePath={imagePath} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/lobby" element={<Lobby />} />
                <Route path="/join-lobby" element={<JoinLobby />} />
                <Route path="/new-game-solo" element={<NewGameSolo />} />
                <Route path="/load-game-solo" element={<LoadGameSolo />} />
                <Route path="/game" element={<GameBoard />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
