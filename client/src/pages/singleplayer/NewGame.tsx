import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

import { ENGINE_IP, ENGINE_HTTP_PORT, ENGINE_WS_PORT } from "../../constants";

import SelectableMenu from "../../components/SelectableMenu";

function NewGameSolo() {
    const ws = useRef<WebSocket | null>(null);

    const navigate = useNavigate();

    const [villains, setVillains] = useState([]);

    const [selectedPlayerVillain, setSelectedPlayerVillain] = useState("");
    const [selectedOpponentVillain, setOpponentVillain] = useState("");

    const opponentMenuShown = selectedPlayerVillain != "";
    const startButtonDisabled = selectedPlayerVillain == "" || selectedOpponentVillain == "";

    useEffect(() => {
        const fetchData = async () => {
            const url = `http://${ENGINE_IP}:${ENGINE_HTTP_PORT}/game/game-settings`;
            const response = await fetch(url);
            const settings = await response.json();
            setVillains(settings["availableVillains"]);
        };
        fetchData();
    }, []);

    useEffect(() => {
        ws.current = new WebSocket(`ws://${ENGINE_IP}:${ENGINE_WS_PORT}`);

        ws.current.addEventListener("message", (event) => {
            const msg = JSON.parse(event.data);

            if (msg["msg_type"] == "soloMode" && msg["msg_subtype"] == "startConfirmation") {
                const payload = msg["payload"];

                const gameId = payload["game_id"];
                const playerId = payload["player_id"];
                localStorage.setItem("game_id", gameId);
                localStorage.setItem("player_id", playerId);

                navigate("/game");
            }
        });

        return () => {
            ws.current?.close();
        };
    }, []);

    function onClickStartGame() {
        ws.current?.send(
            JSON.stringify({
                "msg_type": "soloMode",
                "msg_subtype": "create",
                "villain_one": selectedPlayerVillain,
                "villain_two": selectedOpponentVillain,
            })
        );
    }

    return (
        <div className="contentArea">
            <h3 className="mb-2">Choose Your Villain</h3>
            <SelectableMenu
                items={villains}
                onSelectItem={(villain) => {
                    setSelectedPlayerVillain(villain);
                    setOpponentVillain("");
                }}
                selectedItem={selectedPlayerVillain}
                disabled={false}
            />
            {opponentMenuShown && (
                <>
                    <h3 className="mt-4 mb-2">Select Your Opponent</h3>
                    <SelectableMenu
                        items={villains.filter((villain) => {
                            return villain != selectedPlayerVillain;
                        })}
                        onSelectItem={(villain) => {
                            setOpponentVillain(villain);
                        }}
                        selectedItem={selectedOpponentVillain}
                        disabled={false}
                    />
                </>
            )}
            <div className="mt-4">
                <button
                    type="button"
                    className={"me-4 btn btn-primary" + (startButtonDisabled ? " disabled" : "")}
                    onClick={onClickStartGame}
                >
                    Start Game
                </button>
                <Link to="/">
                    <button className="btn btn-secondary">Back</button>
                </Link>
            </div>
        </div>
    );
}

export default NewGameSolo;
