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
 * Return the player object given by the playerId argument. Throw an error when a non-existent
 * ID is passed.
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
 * Gets the owning player ID of the passed card ID.
 * @param {string} cardId the card ID to obtain the player ID from
 * @returns the player ID of the cardID
 */
function getPlayerIdOfCardId(cardId) {
    if (typeof cardId != "string") {
        throw new Error("cardId must be a string");
    }

    const [playerId, _] = cardId.split("c", 2);

    return playerId;
}

/**
 * Determines if the player has moved by comparing their previous location with their current.
 * @param {object} state the board state
 * @param {string} playerId the id of the player to test
 * @returns `true` if the player has moved, otherwise `false`
 */
function hasPlayerMoved(state, playerId) {
    getPlayerById(state, playerId);

    const prevLoc = state["sectors"][[playerId]]["previous-villain-mover-location"];
    const currLoc = state["sectors"][[playerId]]["villain-mover-location"];

    return prevLoc != currLoc;
}

/**
 * Checks if the passed playerId is in turn for the passed board state
 * @param {object} state the game board
 * @param {string} playerId the player ID to test
 * @returns `true` if the passed player ID is in turn given the board state, otherwise `false`
 */
function isPlayerIdInTurn(state, playerId) {
    getPlayerById(state, playerId);

    return getPlayerIdInTurn(state) == playerId;
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
 * Retrieve a card given by 'cardId' from anywhere on the board.
 * @param {object} state the game state
 * @param {string} cardId the id of the card to return
 * @returns a REFERENCE to the card identified by the id
 */
function getCardById(state, cardId) {
    if (typeof cardId != "string") {
        throw new Error("Id must be a string");
    }

    const playerId = getPlayerIdOfCardId(cardId);

    const player = getPlayerById(state, playerId);

    const playerCards = [];

    ["hand", "villain-deck", "villain-discard-pile", "fate-deck", "fate-discard-pile"].forEach(
        (deck) => {
            playerCards.push(...player[[deck]]);
        }
    );

    for (const location of player["locations"]) {
        playerCards.push(...location["hero-side-cards"]);
        playerCards.push(...location["villain-side-cards"]);
    }

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
 * Get a player's location identified by the passed name. Throws error on invalid ID or location name.
 * @param {object} state the game board
 * @param {string} playerId player to query
 * @param {string} locationName the name of the location to get
 * @returns a REFERENCE to the queried location
 */
function getLocationByName(state, playerId, locationName) {
    const player = getPlayerById(state, playerId);

    const location = player["locations"].find((loc) => loc["name"] == locationName);

    if (location) {
        return location;
    } else {
        throw new Error("Non-existent location provided");
    }
}

/**
 * Gets the player's current location. Throws error on invalid ID.
 * @param {object} state the board state`
 * @param {string} playerId the player ID whose current location to get
 * @returns a REFERENCE to the location object of where the player currently is,
 * or `""` if the player has not moved yet since the game began (in this case, consider
 * calling `hasPlayerMoved`)
 */
function getCurrentLocation(state, playerId) {
    const player = getPlayerById(state, playerId);

    if (player["villain-mover-location"] == "") {
        return "";
    } else {
        return getLocationByName(state, playerId, player["villain-mover-location"]);
    }
}

/**
 * Return whether a card is on the 'villain' or 'hero' side. Throw an error if the card
 * is not at a sector location.
 * @param {object} state the game board
 * @param {string} cardId the card to query
 * @returns 'villain' if the card is on the villain side of the sector,
 * or 'hero' if the card is on the hero side of the sector
 */
function getCardSide(state, cardId) {
    // for existence check
    getCardById(state, cardId);

    const player = getPlayerById(state, getPlayerIdOfCardId(cardId));

    for (const location of player["locations"]) {
        if (location["villain-side-cards"].map((c) => c["card-id"]).includes(cardId)) {
            return "villain";
        } else if (location["hero-side-cards"].map((c) => c["card-id"]).includes(cardId)) {
            return "hero";
        }
    }

    throw new Error("Card is not at a sector location");
}

/**
 * Get the location object of a card
 * @param {object} state the game board
 * @param {string} cardId card to query
 * @returns a REFEREENCE to the location object where the queried card is at,
 * or `null` if the card is not at a sector location
 */
function getCardLocation(state, cardId) {
    getCardById(state, cardId);

    const player = getPlayerById(state, getPlayerIdOfCardId(cardId));

    for (const location of player["locations"]) {
        if (
            location["villain-side-cards"].map((c) => c["card-id"]).includes(cardId) ||
            location["hero-side-cards"].map((c) => c["card-id"]).includes(cardId)
        ) {
            return location;
        }
    }

    return null;
}

/**
 * Get the current Vanquish strength of a card with a 'strength' attribute.
 * @param {object} state the game board
 * @param {string} cardId the card to query
 * @returns The sum of the card's innate strength, additional strength (which may be negative)
 * granted by card effects, and any additional/less strength as based on the card's mechanics.
 * If the strength calculation would be negative, return 0.
 */
function getCardStrength(state, cardId) {
    const card = getCardById(state, cardId);

    if (!card.hasOwnProperty("strength")) {
        throw new Error("The card does not have a strength attribute");
    }
    if (!card.hasOwnProperty("additional-strength")) {
        throw new Error("The card does not have an additional-strength attribute");
    }

    let sum = card["strength"];

    sum += card["additional-strength"];

    if (card["get-temporary-strength"]) {
        const getTemporaryStrengthFn = card["get-temporary-strength"];
        sum += getTemporaryStrengthFn(state, cardId);
    }

    if (sum < 0) {
        return 0;
    } else {
        return sum;
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

    const player = getPlayerById(board, playerId);
    player["previous-villain-mover-location"] = player["villain-mover-location"];

    // Reset taken actions
    if (getVillainLocationNames(board, playerId).includes(player["villain-mover-location"])) {
        // this check ensures getLocationByName doesn't throw when mover location is "" (a player's
        // first turn or when testing)
        const currentLocation = getLocationByName(
            board,
            playerId,
            player["villain-mover-location"]
        );
        currentLocation["taken-actions"] = [];
    }

    return board;
}

/**
 * Execute all functionality that happens for a player who's ending their turn.
 * This includes
 *  * Drawing cards up until the player's current maximum hand size
 * @param {object} state the game board
 * @param {string} playerId the player id who is ending their turn
 * @returns a new game state with the aforementioned functionality executed
 */
function onEndTurn(state, playerId) {
    let board = R.clone(state);
    const player = getPlayerById(board, playerId);

    const numberCardsToDraw = getMaxHandSize(board, playerId) - player["hand"].length;
    if (numberCardsToDraw > 0) {
        for (let i = 0; i < numberCardsToDraw; i++) {
            board = drawVillainCard(board, playerId);
        }
    }

    return board;
}

/**
 * Get the maximum current hand size for the player
 * @param {object} state the game board
 * @param {string} playerId the player to query
 * @returns {number} an integer of the player's current maximum hand size
 */
function getMaxHandSize(state, playerId) {
    const defaultMaxHandSize = 4;

    // Certain cards may increase or decrease by an incremental or to a fixed amount.
    // Figure a way to go through these, like General Grievous' Under Repair.

    // TODO iterate through vehicles and reduce by 1 for every unengaged Hero Vehicle

    return defaultMaxHandSize;
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
 * If the villain deck is empty, reshuffle the villain discard pile into the villain deck,
 * then draw 1 card.
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
 * Subtract a player's credits amount, like when playing a card, in place.
 * @param {object} state the game board
 * @param {string} playerId the player spending credits
 * @param {integer} credits number of credits player is spending
 * @returns a REFERENCE to the modified board
 */
function spendCredits(state, playerId, credits) {
    if (!Number.isInteger(credits)) {
        throw new Error("Credits must be an integer");
    }

    if (credits < 0) {
        throw new Error("Credits must be non-negative");
    }

    const player = getPlayerById(state, playerId);

    if (credits > player["credits"]) {
        throw new Error("Player does not have enough credits");
    }

    player["credits"] = player["credits"] - credits;

    return state;
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

/**
 * Subtract a player's ambition amount.
 * @param {object} state the game board
 * @param {string} playerId the player ID spending ambition
 * @param {integer} ambition number of ambition being spent, must be non-negative
 * @returns a REFERENCE to the modified game board
 */
function spendAmbition(state, playerId, ambition) {
    if (!Number.isInteger(ambition)) {
        throw new Error("Ambition must be an integer");
    }

    if (ambition < 0) {
        throw new Error("Ambition must be non-negative");
    }

    const player = getPlayerById(state, playerId);

    if (ambition > player["ambition"]) {
        throw new Error("Not enough ambition");
    }

    player["ambition"] = player["ambition"] - ambition;

    return state;
}

module.exports = {
    beginGame,
    onBeginTurn,
    onEndTurn,
    getMaxHandSize,
    shuffleDeck,
    drawVillainCard,
    addCredits,
    addAmbition,
    spendCredits,
    spendAmbition,
    getCardById,
    getCardSide,
    getCardLocation,
    getCardStrength,
    getPlayerById,
    getPlayerIdOfCardId,
    getCurrentLocation,
    hasPlayerMoved,
    isPlayerIdInTurn,
    getPlayerIdInTurn,
    getPlayerIds,
    getLocationByName,
    getVillainLocationNames,
};
