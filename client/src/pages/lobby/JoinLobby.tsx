import { useState } from "react";
import { Link } from "react-router";

function JoinLobby() {
    const [joinCode, setJoinCode] = useState("");

    function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setJoinCode(event.target.value);
    }

    return (
        <div className="contentArea text-start">
            <div className="mb-4">
                <label htmlFor="load-game-input" className="form-label">
                    <h4>Join Game ID</h4>
                </label>
                <input id="load-game-input" className="form-control" onChange={onInputChange} />
                <div className="form-text">Input a game ID to join your friends.</div>
            </div>
            <div>
                {joinCode !== "" ? (
                    <Link
                        to="/lobby"
                        onClick={() => {
                            localStorage.setItem("game_id", joinCode);
                        }}
                    >
                        <button className="btn btn-primary me-4">Join</button>
                    </Link>
                ) : (
                    <button className="btn btn-primary me-4 disabled" disabled>
                        Join
                    </button>
                )}
                <Link to="/">
                    <button className="btn btn-secondary">Back</button>
                </Link>
            </div>
        </div>
    );
}

export default JoinLobby;
