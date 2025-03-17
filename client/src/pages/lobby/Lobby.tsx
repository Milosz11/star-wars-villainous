import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router";
import LobbyCard from "../../components/lobby/LobbyCard";
import SelectableMenu from "../../components/SelectableMenu";

interface Session {
    host_id: string;
    max_players: number;
    join_code: string;
    players: {
        playerId: {
            villain: string;
            is_ready: boolean;
        };
    };
}

function Lobby() {
    // Stored in localStorage: game_id, player_id

    // Get prop to this route, 'state'
    const location = useLocation();
    const { ip, restApiPort, wsPort } = location.state;

    const ws = useRef<WebSocket | null>(null);

    // Store the game and client id in local storage to reconnect upon refresh / disconnect.
    // If only game id is truthy but not player id, we send a websocket message for client to join
    // as a new player for that game (/lobby/join).
    // Also, these are stored additionally in React state because they are part of render logic.
    const [localStorageGameId, setLocalStorageGameId] = useState(() => {
        return localStorage.getItem("game_id") || "";
    });
    const [localStorageClientId, setLocalStorageClientId] = useState(() => {
        return localStorage.getItem("player_id") || "";
    });

    const [villains, setVillains] = useState([]);
    const [lobby, setLobby] = useState<Session | null>(null);

    // Get available villains to display or render (TODO consider alternate method of calling API, like moving into getState()?)
    useEffect(() => {
        const fetchData = async () => {
            const url = `http://${ip}:${restApiPort}/game/game-settings`;
            const response = await fetch(url);
            const settings = await response.json();
            setVillains(settings["availableVillains"]);
        };
        fetchData();
    }, []);

    // When rendered, set up component to use a websocket to the server to listen for lobby updates
    // and update lobby information in real time
    useEffect(() => {
        ws.current = new WebSocket(`ws://${ip}:${wsPort}`);

        ws.current.addEventListener("open", (_event) => {
            if (localStorageGameId != "" && localStorageClientId != "") {
                // Client reconnects
                ws.current?.send(
                    JSON.stringify({
                        "msg_type": "lobby",
                        "msg_subtype": "update",
                        "join_code": localStorageGameId,
                        "client_id": localStorageClientId,
                    })
                );
            } else if (localStorageGameId != "" && localStorageClientId == "") {
                // Joining existing lobby
                ws.current?.send(
                    JSON.stringify({
                        "msg_type": "lobby",
                        "msg_subtype": "join",
                        "join_code": localStorageGameId,
                    })
                );
            } else {
                // Creating new lobby
                ws.current?.send(JSON.stringify({ "msg_type": "lobby", "msg_subtype": "create" }));
            }
        });

        ws.current.addEventListener("error", (event) => {
            console.log("Websocket error: ", event);
        });

        ws.current.addEventListener("message", (event) => {
            const msg = JSON.parse(event.data);

            if (msg["msg_type"] == "lobby" && msg["msg_subtype"] == "update") {
                const payload = msg["payload"];

                const joinCode = payload["session"]["join_code"];
                const clientId = payload["client_id"];
                if (localStorageGameId != joinCode || localStorageClientId != clientId) {
                    // Without this if condition, I believe there would we an infinite send /lobby/update ->
                    // receive /lobby/update -> set client and game id states -> rerender -> repeat to send /lobby/update
                    localStorage.setItem("game_id", joinCode);
                    localStorage.setItem("player_id", clientId);
                    setLocalStorageGameId(joinCode);
                    setLocalStorageClientId(clientId);
                }

                setLobby(payload["session"]);
            }
        });

        ws.current.addEventListener("close", (_event) => {
            console.log("Connection to server web socket closed");
        });

        return () => {
            ws.current?.close();
        };
    }, []);

    function onSelectVillain(villain: string) {
        ws.current?.send(
            JSON.stringify({
                "msg_type": "lobby",
                "msg_subtype": "selectVillain",
                "join_code": lobby?.["join_code"],
                "client_id": localStorageClientId,
                "villain": villain,
            })
        );
    }

    function onSetReady(isReady: boolean) {
        ws.current?.send(
            JSON.stringify({
                "msg_type": "lobby",
                "msg_subtype": "ready",
                "join_code": lobby?.["join_code"],
                "client_id": localStorageClientId,
                "is_ready": isReady,
            })
        );
    }

    return (
        <>
            {lobby && (
                <div className="row g-3">
                    {Object.entries(lobby["players"]).map(([playerId, { villain, is_ready }]) => {
                        return (
                            <div className="col g-3" key={playerId} style={{ maxWidth: "540px" }}>
                                <LobbyCard
                                    clientName={playerId}
                                    villain={villain}
                                    isReady={is_ready}
                                />
                                {/* If the player corresponds to the current client */}
                                {playerId == localStorageClientId && (
                                    <>
                                        {/* Villain selection menu */}
                                        <SelectableMenu
                                            items={villains}
                                            onSelectItem={onSelectVillain}
                                            selectedItem={villain}
                                            disabled={is_ready}
                                        />
                                        {/* Ready / unready button */}
                                        <button
                                            type="button"
                                            className={
                                                "mt-3 btn" +
                                                (is_ready ? " btn-danger" : " btn-primary")
                                            }
                                            onClick={() => onSetReady(!is_ready)}
                                            disabled={!villain}
                                        >
                                            {is_ready ? <>Unready</> : <>Ready</>}
                                        </button>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}

export default Lobby;
