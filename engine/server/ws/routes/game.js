function handleGameMessage(socket, msg, clients, sessions) {
    switch (msg["msg_subtype"]) {
        case "view":
            return view(socket, msg, clients, sessions);

        case "playerAction":
            return playerAction(socket, msg, clients, sessions);

        default:
            console.log("Received non-existent message subtype %s", msg["msg_subtype"]);
            return { "error": "Received invalid message subtype" };
    }
}

function view(socket, msg, clients, sessions) {
    returnGameView("-1", "-1", {});
}

function playerAction(socket, msg, clients, sessions) {
    returnGameView("-1", "-1", {});
}

function returnGameView(gameId, playerId, gameView) {
    return {
        "msg_type": "game",
        "msg_subtype": "view",
        "payload": {
            "client_id": playerId,
            "game_id": gameId,
            "game_view": gameView,
        },
    };
}

module.exports = handleGameMessage;
