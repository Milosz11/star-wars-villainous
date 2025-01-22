const randomSeed = require("random-seed");

/**
 * Takes a newly instatiated game board and sets it up for play, shuffling decks, adding intial
 * credits per game rules, and drawing the initial hand
 * @param {*} state
 * @returns
 */
function beginGame(state) {
    return state;
}

/**
 * Shuffle a list given a seed.
 * @param {any[]} toShuffle the list to shuffle
 * @param {string} seedStr the random seed string to use for the first shuffle
 * @returns an object with the shuffled list given by the key 'shuffled',
 * and a new seed given by the key 'seed'
 */
function shuffleDeck(toShuffle, seedStr) {
    if (!Array.isArray(toShuffle)) {
        throw new TypeError("'list' must be an array");
    }
    if (typeof seedStr != "string") {
        throw new TypeError("'seedStr' must be a string");
    }

    // Copy array (should double check when map uses objects)
    let toReturn = toShuffle.map((item) => item);

    // Create generator with passed seed
    const rand = randomSeed.create(seedStr);

    for (let i = toReturn.length - 1; i > 0; i--) {
        let j = Math.floor(rand.random() * (i + 1));
        [toReturn[i], toReturn[j]] = [toReturn[j], toReturn[i]]; // Swap elements
        // Every iteration, set the seed to be something new
        rand.seed(rand.string(seedStr.length));
    }

    return { shuffled: toReturn, seed: rand.string(seedStr.length) };
}

function drawVillainCard(state) {
    return state;
}

/**
 * Increment a player's credit.
 * @param {object} state the board state
 * @param {string} playerId the player it increment the credits for
 * @param {integer} credits how many credits to increment by
 * @returns the new game state with the incremented credit amount
 */
function addCredits(state, playerId, credits) {
    const inPlayPlayerIds = Object.keys(state["sectors"]);
    if (!inPlayPlayerIds.includes(playerId)) {
        throw new Error("Non-existent player id");
    }

    if (!Number.isInteger(credits)) {
        throw new Error("Credit amount must be an integer");
    }

    if (credits < 0) {
        throw new Error("Credit amount must be non-negative");
    }

    state = Object.assign({}, state);

    state["sectors"][[playerId]]["credits"] += credits;

    return state;
}

module.exports = { beginGame, shuffleDeck, drawVillainCard, addCredits };
