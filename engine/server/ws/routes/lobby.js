function handleLobbyMessage(socket, msg, clients, sessions) {
    switch (msg["msg_subtype"]) {
        case "create":
            return create(socket, msg, clients, sessions);

        case "join":
            return join(socket, msg, clients, sessions);

        case "update":
            return update(socket, msg, clients, sessions);

        case "selectVillain":
            return selectVillain(socket, msg, clients, sessions);

        case "ready":
            return ready(socket, msg, clients, sessions);

        case "start":
            return start(socket, msg, clients, sessions);

        default:
            console.log("Received non-existent message subtype %s", msg["msg_subtype"]);
            return { "error": "Received invalid message subtype" };
    }
}

function create(socket, _msg, clients, sessions) {
    // generate game id
    const gameId = Object.keys(sessions).length.toString();
    // generate player id
    const playerId = "p1";
    // insert into clients: socket -> { game_id, player_id }
    clients[[socket]] = {
        "game_id": gameId,
        "player_id": playerId,
    };
    // insert into sessions: game_id -> { host_id, players: player_id -> { socket, villain, is_ready }, max_players }
    const session = {
        "host_id": playerId,
        "max_players": 2,
        "players": {
            [playerId]: {
                "socket": socket,
                "villain": "",
                "is_ready": false,
            },
        },
    };
    sessions[[gameId]] = session;

    // return the session, join code, msg type = /lobby/update
    return returnLobbyUpdate(gameId, playerId, session);
}

function join(socket, msg, clients, sessions) {
    // get game join code
    const gameId = msg["join_code"];

    // check game exists
    if (!Object.keys(sessions).includes(gameId)) {
        return { "error": "The session does not exist." };
    }

    // check num players
    const numMaxPlayers = sessions[[gameId]]["max_players"];
    const numCurrentPlayers = Object.keys(sessions[[gameId]]["players"]).length;
    if (numCurrentPlayers >= numMaxPlayers) {
        return { "error": "The session is full." };
    }

    // generate player id
    const playerId = "p" + (numCurrentPlayers + 1).toString();

    // insert into clients: socket -> { game_id, player_id }
    clients[[socket]] = {
        "game_id": gameId,
        "player_id": playerId,
    };

    // insert into sessions[game code][players]
    sessions[[gameId]]["players"][[playerId]] = {
        "socket": socket,
        "villain": "",
        "is_ready": false,
    };

    return returnLobbyUpdate(gameId, playerId, sessions[[gameId]]);
}

function update(socket, msg, clients, sessions) {
    // TODO check for errors and invalid values
    const { join_code, client_id } = msg;

    return returnLobbyUpdate(join_code, client_id, sessions[[join_code]]);
}

function selectVillain(socket, msg, clients, sessions) {
    // TODO check for errors and invalid values
    const { join_code, client_id, villain } = msg;
    console.log("selectVillain received msg: ", msg);

    sessions[[join_code]]["players"][[client_id]]["villain"] = villain;

    return returnLobbyUpdate(join_code, client_id, sessions[[join_code]]);
}

function ready(socket, msg, clients, sessions) {
    // TODO check for errors and invalid values
    const { join_code, client_id, is_ready } = msg;
    console.log("ready received msg: ", msg);

    sessions[[join_code]]["players"][[client_id]]["is_ready"] = is_ready;

    return returnLobbyUpdate(join_code, client_id, sessions[[join_code]]);
}

function start(socket, msg, clients, sessions) {
    return { "lobby": "start" };
}

/**
 * Create a /lobby/update message.
 *
 * @param {string} gameId the gameId
 * @param {string} playerId the playerId who called this (TODO this will change when implementing broadcasting)
 * @param {object} session the updated session
 * @returns the full message with the passed parameters
 */
function returnLobbyUpdate(gameId, playerId, session) {
    return {
        "msg_type": "lobby",
        "msg_subtype": "update",
        "payload": {
            "client_id": playerId, // TODO when i get to broadcasting updates to all clients in a session
            // this will need to change, either to every session's clients' id
            "session": {
                ...session,
                "join_code": gameId,
            },
        },
    };
}

module.exports = handleLobbyMessage;
