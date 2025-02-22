function handleLobbyMessage(socket, msg, clients, sessions) {
    switch (msg["msg_subtype"]) {
        case "create":
            return create(socket, msg, clients, sessions);

        case "join":
            return join(socket, msg, clients, sessions);

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

function create(socket, msg, clients, sessions) {
    // generate game id
    // generate player id
    // insert into clients: socket -> { gameId, playerId }
    // insert into sessions: gameId -> { hostId, players: playerId -> { socket, villain, isReady }, maxPlayers }
    // return the session, join code, msg type = /lobby/update

    return { "lobby": "create" };
}

function join(socket, msg, clients, sessions) {
    // get game join code
    // check num players
    // generate game id
    // generate player id
    // insert into clients: socket -> { gameId, playerId }
    // insert into sessions[game code][players]
    // return the sessions, join code, msg type = /lobby/update

    return { "lobby": "join" };
}

function selectVillain(socket, msg, clients, sessions) {
    return { "lobby": "selectVillain" };
}

function ready(socket, msg, clients, sessions) {
    return { "lobby": "ready" };
}

function start(socket, msg, clients, sessions) {
    return { "lobby": "start" };
}

module.exports = handleLobbyMessage;
