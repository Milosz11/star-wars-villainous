import { BrowserRouter, Routes, Route } from "react-router";

import "./App.css";
import Header from "./components/Header";
import Home from "./pages/Home";
import LoadGame from "./pages/LoadGame";
import NewGame from "./pages/NewGame";

function App() {
    const title = "Star Wars Villainous";
    const imagePath = "../../logo.jpg";

    return (
        <BrowserRouter>
            <Header title={title} imagePath={imagePath} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/new-game" element={<NewGame />} />
                <Route path="/load-game" element={<LoadGame />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
