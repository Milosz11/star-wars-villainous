const R = require("ramda");
const { getPlayerById, getPlayerIds, getVillainLocationNames } = require("./core");

/**
 * Move a player's villain mover to a new location.
 * Players must move once to a new location every turn.
 * @param {object} state the game board
 * @param {string} playerId the player whose villain mover to move
 * @param {string} locationName the new location to move to
 * @returns a new game state with the player's villain mover at the new location
 */
function moveVillain(state, playerId, locationName) {
    if (!getPlayerIds(state).includes(playerId)) {
        throw new Error("Non-existent player id");
    }

    const originalPlayer = getPlayerById(state, playerId);
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

module.exports = {
    moveVillain,
};
