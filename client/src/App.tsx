import { BrowserRouter, Routes, Route } from "react-router";

import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import JoinLobby from "./pages/JoinLobby";
import Lobby from "./pages/Lobby";

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
            </Routes>
        </BrowserRouter>
    );
}

export default App;
