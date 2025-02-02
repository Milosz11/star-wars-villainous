const R = require("ramda");
const {
    getPlayerById,
    getPlayerIds,
    getVillainLocationNames,
    onEndTurn,
    onBeginTurn,
} = require("./core");

/**
 * Move a player's villain mover to a new location.
 * Players must move once to a new location every turn.
 * @param {object} state the game board
 * @param {string} playerId the player whose villain mover to move
 * @param {string} locationName the new location to move to
 * @returns a new game state with the player's villain mover at the new location
 */
function moveVillain(state, playerId, locationName) {
    const originalPlayer = getPlayerById(state, playerId);

    if (state["player-id-in-turn"] != playerId) {
        throw new Error("Player is not in turn");
    }

    if (
        originalPlayer["previous-villain-mover-location"] !=
        originalPlayer["villain-mover-location"]
    ) {
        throw new Error("Player has already moved this turn");
    }

    if (!getVillainLocationNames(state, playerId).includes(locationName)) {
        throw new Error("Non-existent location provided");
    }

    if (originalPlayer["villain-mover-location"] == locationName) {
        throw new Error("Must move to a new location");
    }

    const board = R.clone(state);
    const player = getPlayerById(board, playerId);
    player["villain-mover-location"] = locationName;

    return board;
}

/**
 * End a player's turn.
 * Players draw cards up to their current maximum hand size at the end of a turn.
 * This function sets up play for the next player.
 * @param {object} state the game board
 * @param {string} playerId the player who is ending their turn
 * @returns a new game board after the current player's turn ends
 */
function endTurn(state, playerId) {
    const player = getPlayerById(state, playerId);

    if (state["player-id-in-turn"] != playerId) {
        throw new Error("Player is not in turn");
    }

    // Validate player has moved
    if (player["villain-mover-location"] == player["previous-villain-mover-location"]) {
        throw new Error("Player must move to a new location every turn");
    }

    let board = onEndTurn(state, playerId);

    // Change player id to next
    const playerIdList = getPlayerIds(board);
    const currentIdIndex = playerIdList.indexOf(playerId);
    if (currentIdIndex == -1) {
        throw new Error("Something went terribly wrong.");
    }
    const nextIdIndex = (currentIdIndex + 1) % playerIdList.length;
    board["player-id-in-turn"] = playerIdList[nextIdIndex];

    board["counter"] = board["counter"] + 1;

    board = onBeginTurn(board, board["player-id-in-turn"]);

    return board;
}

module.exports = {
    moveVillain,
    endTurn,
};
