import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router";
import LobbyCard from "../components/LobbyCard";
import SelectableMenu from "../components/SelectableMenu";

interface Session {
    host_id: string;
    max_players: number;
    join_code: string;
    players: {
        playerId: {
            villain: string;
            isReady: boolean;
        };
    };
}

function Lobby() {
    // Stored in sessionStorage: game_id, player_id

    // Get prop to this route, 'state'
    const location = useLocation();
    // If someone joins through Join Game, joinCode should be the game id they're joining;
    // otherwise, undefined means we are creating a new lobby
    const { ip, restApiPort, wsPort } = location.state;
    var { playerInputtedJoinCode } = location.state;

    const ws = useRef<WebSocket | null>(null);

    const [villains, setVillains] = useState([]);
    const [clientId, setClientId] = useState("");
    const [lobby, setLobby] = useState<Session | null>(null);

    useEffect(() => {
        const cId = sessionStorage.getItem("player_id");
        if (cId) {
            setClientId(cId);
        }
    }, []);

    // Get available villains to display or render (TODO consider alternate method of calling API)
    useEffect(() => {
        const fetchData = async () => {
            const url = `http://${ip}:${restApiPort}/game/game-settings`;
            const response = await fetch(url);
            const settings = await response.json();
            setVillains(settings["availableVillains"]);
        };
        fetchData();
        console.log(villains);
    }, []);

    // When rendered, set up component to use a websocket to the server to listen for lobby updates
    // and update lobby information in real time
    useEffect(() => {
        ws.current = new WebSocket(`http://${ip}:${wsPort}`);

        ws.current.addEventListener("open", (_event) => {
            console.log("Connected to server web socket");

            if (playerInputtedJoinCode) {
                // Joining existing lobby
                ws.current?.send(
                    JSON.stringify({
                        "msg_type": "lobby",
                        "msg_subtype": "join",
                        "join_code": playerInputtedJoinCode,
                    })
                );
                playerInputtedJoinCode = null;
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
                console.log(payload);
                sessionStorage.setItem("game_id", payload["session"]["join_code"]);
                sessionStorage.setItem("player_id", payload["client_id"]);
                setClientId(payload["client_id"]);
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

    function onSelectVillain(villain: string | null) {
        ws.current?.send(
            JSON.stringify({
                "msg_type": "lobby",
                "msg_subtype": "selectVillain",
                "join_code": lobby?.["join_code"],
                "client_id": clientId,
                "villain": villain ?? "",
            })
        );
    }

    return (
        <>
            {lobby && (
                <div className="row g-3">
                    {Object.entries(lobby["players"]).map(([playerId, { villain, isReady }]) => {
                        return (
                            <div className="col g-3" key={playerId} style={{ maxWidth: "360px" }}>
                                <LobbyCard
                                    clientName={playerId}
                                    villain={villain}
                                    isReady={isReady}
                                />
                                {playerId == clientId && (
                                    <SelectableMenu
                                        items={villains}
                                        onSelectItem={onSelectVillain}
                                    />
                                )}
                                {isReady && <div>Is REEADY EOSUTN</div>}
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}

export default Lobby;
