const fs = require("node:fs");
const { getVillainDefinition, getCardDefinition } = require("../definitions/definition-loader");

function instantiateStartingBoardState(...villainNames) {
    if (villainNames.length < 2 || villainNames.length > 2) {
        throw new Error("Improper length of villain names");
    }

    const data = fs.readFileSync("game-settings.json", "utf-8");
    const settings = JSON.parse(data);
    const availableVillains = settings["availableVillains"];

    for (const v of villainNames) {
        if (!availableVillains.includes(v)) {
            throw new Error("Bad villain name value");
        }
    }

    const duplicates = villainNames.filter((v, index) => villainNames.indexOf(v) !== index);
    if (duplicates.length > 0) {
        throw new Error("Duplicate villain names passed");
    }

    // For each villain, create a unique player id and associate with their
    // villain's instantiated sector.
    const sectors = villainNames.reduce((acc, villainName, index) => {
        const villain = instantiateVillain(villainName);
        const playerId = "p" + (index + 1);
        return Object.assign(acc, { [playerId]: villain });
    }, {});

    return {
        "counter": 0,
        "player-id-in-turn": "p1",
        "sectors": sectors,
    };
}

function instantiateVillain(villainName) {
    const villainDefinition = getVillainDefinition(villainName);

    const repeat = (count, value) => {
        let ret = [];
        for (let i = 0; i < count; i++) {
            ret.push(value);
        }
        return ret;
    };

    return {
        "villain-name": villainDefinition["villain-name"],
        "objective": villainDefinition["objective"],
        "villain-mover-position": 0,
        "ambition": 0,
        "credits": 0,
        "locations": villainDefinition["locations"].map((location) => {
            return Object.assign(location, {
                "taken-actions": [],
                "hero-side-cards": [],
                "villain-side-cards": [],
            });
        }),
        "hand": [],
        "villain-deck": villainDefinition["villain-deck"].reduce((acc, cardEntry) => {
            const { count, name } = cardEntry;
            const card = instantiateCard(villainName, name);
            return acc.concat(repeat(count, card));
        }, []),
        "villain-discard-pile": [],
        "fate-deck": villainDefinition["fate-deck"].reduce((acc, cardEntry) => {
            const { count, name } = cardEntry;
            const card = instantiateCard(villainName, name);
            return acc.concat(repeat(count, card));
        }, []),
        "fate-discard-pile": [],
    };
}

function instantiateCard(villainName, cardName) {
    const cardDefinition = getCardDefinition(villainName, cardName);

    return Object.assign(cardDefinition, getLiveCardTypeKvs(cardDefinition["card-type"]));
}

function getLiveCardTypeKvs(cardType) {
    switch (cardType) {
        case "Ally":
            return {
                "attached-cards": [],
                "additional-strength": 0,
            };
        case "Hero":
            return {
                "attached-cards": [],
                "additional-strength": 0,
            };
        default:
            return {};
    }
}

module.exports = { instantiateStartingBoardState };
