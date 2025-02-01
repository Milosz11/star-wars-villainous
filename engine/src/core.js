const R = require("ramda");
const randomSeed = require("random-seed");

/**
 * Get all the player ids in the passed game board
 * @param {object} state the board state
 * @returns a list of ids of the players in the game
 */
function getPlayerIds(state) {
    return Object.keys(state["sectors"]);
}

/**
 * Return the id of the player whose turn it is
 * @param {object} state the board state
 * @returns a string of the current player that is in turn
 */
function getPlayerIdInTurn(state) {
    return state["player-id-in-turn"];
}

/**
 * Return the player object given by the playerId argument.
 * @param {object} state the board state
 * @param {string} playerId the id of the player (villain) to return
 * @returns a REFERENCE to the player sector identified by the id
 */
function getPlayerById(state, playerId) {
    const inPlayPlayerIds = Object.keys(state["sectors"]);
    if (!inPlayPlayerIds.includes(playerId)) {
        throw new Error("Non-existent player id");
    }

    return state["sectors"][[playerId]];
}

/**
 * Get all current villain locations by name.
 * @param {object} state the board state
 * @param {string} playerId the query villain / player ID
 * @returns a string list of all current locations belonging to player
 */
function getVillainLocationNames(state, playerId) {
    return getPlayerById(state, playerId)["locations"].map((loc) => loc["name"]);
}

/**
 * return the card object given by the cardId argument.
 * @param {object} state the game state
 * @param {string} cardId the id of the card to return
 * @returns a REFERENCE to the card identified by the id
 */
function getCardById(state, cardId) {
    if (typeof cardId != "string") {
        throw new Error("Id must be a string");
    }

    // We don't expect the possibility of having up to a p10 now so this should be fine.
    const playerId = cardId.substring(0, 2);

    const player = getPlayerById(state, playerId);

    const playerCards = [];

    ["hand", "villain-deck", "villain-discard-pile", "fate-deck", "fate-discard-pile"].forEach(
        (deck) => {
            playerCards.push(...player[[deck]]);
        }
    );

    const foundCard = playerCards.find((card) => {
        return card["card-id"] == cardId;
    });

    if (foundCard == undefined) {
        throw new Error("Non-existent card id");
    } else {
        return foundCard;
    }
}

/**
 * Takes a newly instantiated game board and sets it up for play, shuffling decks, adding intial
 * credits per game rules, and drawing the initial hand. Also, calls the onBeginTurn callback for
 * the first player.
 * @param {object} state the board state
 * @returns the state of the board ready for play
 */
function beginGame(state) {
    let board = R.clone(state);

    // Add credits
    board = addCredits(board, "p2", 1);

    // Shuffle villain and fate decks for each player
    for (const playerId of getPlayerIds(board)) {
        const player = getPlayerById(board, playerId);
        const kvs1 = shuffleDeck(player["villain-deck"], board["seed"]);
        player["villain-deck"] = kvs1["shuffled"];
        board["seed"] = kvs1["seed"];
        const kvs2 = shuffleDeck(player["fate-deck"], board["seed"]);
        player["fate-deck"] = kvs2["shuffled"];
        board["seed"] = kvs2["seed"];
    }

    // Draw 4 cards for each player
    for (const playerId of getPlayerIds(board)) {
        for (let i = 0; i < 4; i++) {
            board = drawVillainCard(board, playerId);
        }
    }

    return onBeginTurn(board, "p1");
}

/**
 * Execute all functionality that happens for a player who's starting their turn.
 * This includes
 *  * Gain one ambition (should not trigger game effects like 'on-gain-ambition')
 *  * Increment the game turn counter
 *  * Update the player's previous villain mover location to their current location
 *  * Reset taken actions at the player's current location
 * @param {object} state the game board
 * @param {string} playerId the player id who is beginning their turn
 * @returns a new game state with the aforementioned functionality executed
 */
function onBeginTurn(state, playerId) {
    if (!getPlayerIds(state).includes(playerId)) {
        throw new Error("Non-existent player id");
    }

    // Our deep copy
    const board = addAmbition(state, playerId, 1);

    board["counter"] = board["counter"] + 1;

    const player = getPlayerById(board, playerId);
    player["previous-villain-mover-location"] = player["villain-mover-location"];

    // TODO reset taken actions

    return board;
}

/**
 * Shuffle a list given a seed.
 * @param {any[]} toShuffle the list to shuffle
 * @param {string} seedStr the random seed string to use for the first shuffle
 * @returns an object with the shuffled list (a deep copy) given by the key 'shuffled',
 * and a new seed given by the key 'seed'
 */
function shuffleDeck(toShuffle, seedStr) {
    if (!Array.isArray(toShuffle)) {
        throw new TypeError("'list' must be an array");
    }
    if (typeof seedStr != "string") {
        throw new TypeError("'seedStr' must be a string");
    }

    let toReturn = R.clone(toShuffle);

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

/**
 * Draw 1 villain card from the player's villain deck and put it into the player's hand.
 * If the villain deck is empty, reshuffle the villain discard pile into the villain deck.
 * @param {object} state the board state
 * @param {string} playerId the player to which draw a villain card for
 * @returns the new deep-copied game state with a villain card drawn
 */
function drawVillainCard(state, playerId) {
    if (!getPlayerIds(state).includes(playerId)) {
        throw new Error("Non-existent player id");
    }

    const board = R.clone(state);
    const player = getPlayerById(board, playerId);

    if (player["villain-deck"].length == 0) {
        const { shuffled, seed } = shuffleDeck(player["villain-discard-pile"], board["seed"]);
        player["villain-discard-pile"] = [];
        player["villain-deck"] = shuffled;
        board["seed"] = seed;
    }

    const topVillainCard = player["villain-deck"].shift();
    player["hand"].push(topVillainCard);

    return board;
}

/**
 * Increment a player's credit.
 * @param {object} state the board state
 * @param {string} playerId the player id to increment the credits for
 * @param {integer} credits how many credits to increment by
 * @returns the new deep-copied game state with the incremented credit amount
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

    const board = R.clone(state);

    board["sectors"][[playerId]]["credits"] += credits;

    return board;
}

/**
 * Increment a player's ambition.
 * @param {object} state the board state
 * @param {string} playerId the player id to increment the ambition for
 * @param {integer} ambition how many ambition to increment by
 * @returns the new deep-copied game state with the incremented ambition amount
 */
function addAmbition(state, playerId, ambition) {
    const inPlayPlayerIds = Object.keys(state["sectors"]);
    if (!inPlayPlayerIds.includes(playerId)) {
        throw new Error("Non-existent player id");
    }

    if (!Number.isInteger(ambition)) {
        throw new Error("Ambition amount must be an integer");
    }

    if (ambition < 0) {
        throw new Error("Ambition amount must be non-negative");
    }

    const board = R.clone(state);

    board["sectors"][[playerId]]["ambition"] += ambition;

    return board;
}

module.exports = {
    beginGame,
    onBeginTurn,
    shuffleDeck,
    drawVillainCard,
    addCredits,
    addAmbition,
    getCardById,
    getPlayerById,
    getPlayerIdInTurn,
    getPlayerIds,
    getVillainLocationNames,
};
