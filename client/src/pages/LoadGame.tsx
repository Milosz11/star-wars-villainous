import { useState } from "react";
import { Link } from "react-router";

function LoadGame() {
    const [gameId, setGameId] = useState("");

    function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setGameId(event.target.value);
    }

    return (
        <div className="contentArea text-start">
            <div className="mb-4">
                <label htmlFor="load-game-input" className="form-label">
                    <h4>Load Game ID</h4>
                </label>
                <input id="load-game-input" className="form-control" onChange={onInputChange} />
                <div className="form-text">
                    Enter the game ID you received upon exiting a previous game.
                </div>
            </div>
            <div>
                <button
                    className={"btn btn-primary me-4" + (gameId == "" ? " disabled" : "")}
                    onClick={(_event) => {
                        console.log(gameId);
                    }}
                >
                    Load
                </button>
                <Link to="/">
                    <button className="btn btn-secondary">Back</button>
                </Link>
            </div>
        </div>
    );
}

export default LoadGame;
