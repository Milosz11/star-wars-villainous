const { WebSocketServer } = require("ws");

const handleLobbyMessage = require("./routes/lobby");
const handleGameMessage = require("./routes/game");

const clients = {};
const sessions = {};

function createWebSocketServer(port) {
    const wss = new WebSocketServer({ port }, () => {
        console.log("Web Socket Server listening on port %s", port);
    });

    wss.on("close", () => {
        console.log("Web Socket Server closed.");
    });

    wss.on("error", console.error);

    wss.on("connection", (socket, request) => {
        socket.on("error", console.error);

        socket.on("close", (code, reason) => {
            console.log(`Connection closed. Code: ${code}, reason: ${reason})}`);
        });

        socket.on("message", (data, isBinary) => {
            console.log("Received: %s", data);

            let msg;
            try {
                msg = JSON.parse(data);
            } catch (e) {
                socket.send(JSON.stringify({ "error": "Invalid JSON format" }));
                return;
            }

            let responseJson;
            switch (msg["msg_type"]) {
                case "lobby":
                    responseJson = handleLobbyMessage(socket, msg, clients, sessions);
                    break;

                case "game":
                    responseJson = handleGameMessage(socket, msg, clients, sessions);
                    break;

                default:
                    console.log("Received non-existent message type %s", msg["msg_type"]);
                    responseJson = { "error": "Received invalid message type" };
                    break;
            }

            socket.send(JSON.stringify(responseJson));
        });
    });
}

module.exports = createWebSocketServer;
