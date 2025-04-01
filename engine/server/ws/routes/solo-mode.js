function handleSoloModeMessage(socket, msg, clients, sessions) {
    switch (msg["msg_subtype"]) {
        case "create":
            return soloModeCreate(socket, msg, clients, sessions);

        default:
            console.log("Received non-existent message subtype %s", msg["msg_subtype"]);
            return { "error": "Received invalid message subtype" };
    }
}

function soloModeCreate(socket, msg, clients, sessions) {
    const gameId = Object.keys(sessions).length.toString();

    const playerOneId = "p1";
    const playerTwoId = "p2";

    // TODO check villains valid
    const villainOne = msg["villain_one"];
    const villainTwo = msg["villain_two"];

    // create a client entry, possibly one2many
    clients[[socket]] = [
        { "game_id": gameId, "player_id": playerOneId },
        { "game_id": gameId, "player_id": playerTwoId },
    ];
    // create a session
    sessions[[gameId]] = {
        "host_id": playerOneId,
        "max_players": 2,
        "players": {
            [playerOneId]: {
                "socket": socket,
                "villain": villainOne,
                "is_ready": true,
            },
            [playerTwoId]: {
                "socket": socket,
                "villain": villainTwo,
                "is_ready": true,
            },
        },
    };

    // CALL THE FUNCTION TO START THE GAME

    return {
        "msg_type": "soloMode",
        "msg_subtype": "startConfirmation",
        "payload": {
            "player_id": playerOneId,
            "game_id": gameId,
        },
    };
}

module.exports = handleSoloModeMessage;
