import { useEffect, useRef, useState } from "react";
import { ENGINE_IP, ENGINE_WS_PORT } from "../../constants";

function GameBoard() {
    const ws = useRef<WebSocket | null>(null);

    const [gameBoard, setGameBoard] = useState<object | null>(null);

    useEffect(() => {
        ws.current = new WebSocket(`ws://${ENGINE_IP}:${ENGINE_WS_PORT}`);

        ws.current.addEventListener("open", (_event) => {
            const player_id = localStorage.getItem("player_id");
            const game_id = localStorage.getItem("game_id");

            ws.current?.send(
                JSON.stringify({
                    "msg_type": "game",
                    "msg_subtype": "view",
                    "payload": {
                        "game_id": game_id,
                        "player_id": player_id,
                    },
                })
            );
        });

        ws.current.addEventListener("message", (event) => {
            console.log(event.data);

            const msg = JSON.parse(event.data);

            if (msg["msg_type"] == "game" && msg["msg_subtype"] == "view") {
                const payload = msg["payload"];

                // const gameId = payload["game_id"]; // Currently not needed
                const playerId = payload["player_id"];
                const gameView = payload["game_view"];

                if (false) {
                    // TODO check if playing solo mode
                    localStorage.setItem("player_id", playerId);
                }

                setGameBoard(gameView);
                console.log(gameView); // TODO remove this
            }
        });

        return () => {
            ws.current?.close();
        };
    }, []);

    return <>Hello, this is my game board.</>;
}

export default GameBoard;
