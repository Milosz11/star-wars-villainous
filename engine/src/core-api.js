const R = require("ramda");
const {
    getPlayerById,
    getPlayerIds,
    getVillainLocationNames,
    onEndTurn,
    onBeginTurn,
    getPlayerIdInTurn,
    hasPlayerMoved,
    isPlayerIdInTurn,
    getLocationByName,
    getCurrentLocation,
    addCredits,
    getCardById,
    spendCredits,
    getCardSide,
    getCardLocation,
    getCardStrength,
} = require("./core");

/**
 * Functions with a '_' at the beginning of their name are not intended to be called from outside
 * this file. However, they must be exported for testing.
 */

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

    if (!isPlayerIdInTurn(state, playerId)) {
        throw new Error("Player is not in turn");
    }

    if (hasPlayerMoved(state, playerId)) {
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
    getPlayerById(state, playerId);

    if (!isPlayerIdInTurn(state, playerId)) {
        throw new Error("Player is not in turn");
    }

    // Validate player has moved
    if (!hasPlayerMoved(state, playerId)) {
        throw new Error("Player must move to a new location every turn");
    }

    // our deep copy
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

/**
 * Determine if a player could take an action. Test for player id in turn, that the player has
 * moved this turn, any blocking hero cards, and other sanity checks.
 * If an action is determined valid, return true, otherwise throw an error.
 * @param {object} state the game board
 * @param {string} playerId player to take an action for
 * @param {string} action the action to test as written on the board
 * @returns true if taking the action is valid, throws error otherwise
 */
function _canTakeAction(state, playerId, action) {
    // check player id
    getPlayerById(state, playerId);

    // check player in turn
    if (!isPlayerIdInTurn(state, playerId)) {
        throw new Error("Player is not in turn");
    }

    // check player has moved
    if (!hasPlayerMoved(state, playerId)) {
        throw new Error("Player must move before taking actions");
    }

    const currentLocation = getCurrentLocation(state, playerId);

    // check current location has action
    if (!currentLocation["actions"].includes(action)) {
        throw new Error("Location does not have specified action");
    }

    // check if action is blocked (actions in villain definition are in English reading order,
    // so the hero-side actions are the first 2 in the list)
    if (currentLocation["actions"].indexOf(action) < 2) {
        if (currentLocation["hero-side-cards"].some((card) => card["card-type"] == "Hero")) {
            throw new Error("The action is blocked by a Hero card");
        }
    }

    // check if the action was already taken
    if (currentLocation["taken-actions"].includes(action)) {
        throw new Error("This action was already taken");
    }

    return true;
}

/**
 * Handles generic information regarding an action, like checking if it could be taken and adding
 * it to the location's taken-actions list.
 * This function calls the specific action handler, propagating the parameter 'kvs', where
 * additional information for that action may be passed.
 * @param {object} board the game board
 * @param {string} playerId the player taking the action
 * @param {string} action the action as written on the game board
 * @param {object} kvs a dictionary of additional key-values as required by the specific
 * action function. For example, the "Play a Card" actions needs a "card-id" key with a value
 * of the id of the desired card to play.
 * @returns a new game board with the passed action executed
 */
function takeAction(state, playerId, action, kvs) {
    _canTakeAction(state, playerId, action);

    let board = R.clone(state);

    switch (action) {
        case "Collect 1 Credit":
            board = _collectCredits(board, playerId, 1);
            break;

        case "Collect 2 Credits":
            board = _collectCredits(board, playerId, 2);
            break;

        case "Collect 3 Credits":
            board = _collectCredits(board, playerId, 3);
            break;

        case "Play a Card":
            board = _playCard(board, playerId, kvs["card-id"], kvs);
            break;

        case "Vanquish":
            board = _vanquish(board, playerId, kvs["vanquished-id"], kvs["vanquisher-ids"], kvs);
            break;

        default:
            throw new Error("Bad action string specified");
    }

    const location = getCurrentLocation(board, playerId);
    location["taken-actions"].push(action);

    return board;
}

/**
 * Perform a Collect Credits action for the specified player. For every card in play,
 * call its on-collect-credits callback, if applicable. Return a new board.
 * @param {object} state the game board
 * @param {string} playerId the player performing the action
 * @param {int} credits number of credits to gain
 * @returns a new game board
 */
function _collectCredits(state, playerId, credits) {
    if (credits < 1 || credits > 3) {
        throw new Error("Bad credit amount");
    }

    let board = addCredits(state, playerId, credits);

    // TODO loop on each card in play and activate on-collect-credits (state, playerId, thisId, kvs)
    // kvs = { "credits-collected": creditAmount }
    // make sure to not activate this player's cards (will depend on every card's wording)

    return board;
}

/**
 * Perform a Play a Card action for the specified player. Play a Card is used to play a card that
 * costs credits. Activate this card's on-play-card, if applicable.
 * For every other card in play, call its on-other-card-played callback, if applicable.
 * Return a new board.
 * @param {object} state the game board
 * @param {string} playerId the player performing the action
 * @param {string} cardId the card id to play from the hand of the player
 * @param {object} kvs additional information for the card being played. If the card is of type
 * Ally or Vehicle, the key "location" is required. If the type is Item, a "location" or "card-id"
 * of a card to attach to is required, depending on the specific item. For other cards, their unique
 * information needs to be provided
 * @returns a new game board
 */
function _playCard(state, playerId, cardId, kvs) {
    let board = R.clone(state);

    // check player
    const player = getPlayerById(board, playerId);
    // check card
    const card = getCardById(board, cardId);

    // check card belongs to player
    if (playerId.substring(0, 2) != cardId.substring(0, 2)) {
        throw new Error("Card does not belong to player");
    }

    // check card costs credits
    if (card["credit-cost"] == undefined) {
        throw new Error("Can only play cards that cost credits with a Play a Card action");
    }

    // if the card is an ally or vehicle, ensure location is provided
    if (card["card-type"] == "Ally" || card["card-type"] == "Vehicle") {
        if (!kvs["location"]) {
            // empty string also satisfies this condition
            throw new Error("Ally or Vehicle needs a location to play to");
        }
    }

    // if the card is an item, ensure location or other card-id depending on other item card keys
    if (card["card-type"] == "Item") {
        // TODO not yet implemented
    }

    // subtract credits
    spendCredits(board, playerId, card["credit-cost"]);

    // remove from hand
    player["hand"] = player["hand"].filter((c) => c["card-id"] != cardId);

    if (card["card-type"] == "Ally" || card["card-type"] == "Vehicle") {
        // play to location
        const locationToPlayCard = getLocationByName(board, playerId, kvs["location"]);
        locationToPlayCard["villain-side-cards"].push(card);
    } else if (card["card-type"] == "Item") {
        // depending on item, play to location or other card
        // NOT YET IMPLEMENTED
        // if card is item, add to location, ally or vehicle then remove from hand OR discard
    } else {
        // add to discard pile
        // treating deck like a stack, first element is on top
        player["villain-discard-pile"].unshift(card);
    }

    // perform the card's on-play-card callback function
    if (card["on-play-card"]) {
        const onPlayCardFn = card["on-play-card"];
        board = onPlayCardFn(board, playerId, cardId, kvs); // assume this returns a new state
    }

    // TODO iterate every card in the game except this one, and call on-other-card-played callback
    // (state, playerId, thisId, kvs) kvs = { "card-id" : cardId }

    return board;
}

/**
 * Perform a Vanquish action. A Vanquish action uses one or more Allies to defeat a character,
 * usually a Hero.
 * @param {object} state the game board
 * @param {string} playerId the player performing the action
 * @param {string} vanquishedId the id of the hero-side card being vanquished
 * @param {string[]} vanquisherIds the array of ids of villain-side cards vanquishing the hero-side card
 * @param {object} kvs additional parameters for the vanquish action
 * @returns a new game board
 */
function _vanquish(state, playerId, vanquishedId, vanquisherIds, kvs) {
    getPlayerById(state, playerId);

    // check all ids belong to player
    const allVanquishCardIds = vanquisherIds.concat(vanquishedId);
    if (allVanquishCardIds.some((id) => id.substring(0, 2) != playerId)) {
        throw new Error("Player does not own card");
    }

    // check vanquished is on hero side
    if (getCardSide(state, vanquishedId) != "hero") {
        throw new Error("The card to be vanquished is not on the hero side");
    }

    // check vanquishers are on the villain side
    if (vanquisherIds.some((id) => getCardSide(state, id) != "villain")) {
        throw new Error("The vanquishing cards must be on the villain side");
    }

    // check that all cards in the same location (except ones that can vanquish adjacent locations)
    const vanquishLocationName = getCardLocation(state, vanquishedId)["name"];
    if (
        vanquisherIds
            .map((id) => getCardLocation(state, id)["name"])
            .some((locationName) => locationName != vanquishLocationName)
    ) {
        throw new Error("All vanquishers are not at the location of the card to be vanquished");
    }

    // check all cards have a strength attribute
    if (
        allVanquishCardIds
            .map((id) => getCardById(state, id))
            .filter((card) => card["card-type"] != "Vehicle")
            .some((card) => !card.hasOwnProperty("strength"))
    ) {
        throw new Error("The cards do not have a strength attribute");
    }

    // check strength of allies and hero
    const heroSideStrength = getCardStrength(state, vanquishedId);
    const villainSideStrength = vanquisherIds.reduce((acc, id) => {
        return acc + getCardStrength(state, id);
    }, 0);
    if (villainSideStrength < heroSideStrength) {
        throw new Error(
            "The villain-side cards are not strong enough to defeat the hero-side card"
        );
    }

    const board = R.clone(state);
    const player = getPlayerById(board, playerId);
    const vanquishLocation = getLocationByName(board, playerId, vanquishLocationName);

    // remove hero side card to fate discard pile
    const vanquishedCard = getCardById(board, vanquishedId);
    vanquishLocation["hero-side-cards"] = vanquishLocation["hero-side-cards"].filter(
        (card) => card["card-id" != vanquishedId]
    );
    player["fate-discard-pile"].unshift(vanquishedCard);

    // remove all vanquisher cards to villain discard pile
    const vanquisherCards = vanquisherIds.map((id) => getCardById(board, id));
    vanquishLocation["villain-side-cards"] = vanquishLocation["villain-side-cards"].filter(
        (card) => {
            !vanquisherIds.includes(card["card-id"]);
        }
    );
    player["villain-discard-pile"].unshift(...vanquisherCards);

    return board;
}

module.exports = {
    _canTakeAction,
    _collectCredits,
    _playCard,
    _vanquish,
    moveVillain,
    endTurn,
    takeAction,
};
