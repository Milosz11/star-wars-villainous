const fs = require("node:fs");
const { getVillainDefinition, getCardDefinition } = require("../definitions/definition-loader");

/**
 * Shorthand for quickly constructing states for testing.
 * @param {any[]} villainsOrVillainNames A list containing strings of villain names or object
 * definitions of those villains.
 *
 * In the case of a string, the villain will be created from their default definition with their
 * decks shuffled, but will not have their credit amounts altered.
 *
 * In the case of an object, the key 'villain-name' is required. The keys 'hand', 'villain-deck',
 * 'villain-discard-pile', 'fate-deck', and 'fate-discard-pile' use the string shorthand.
 * This means they take a string list of the names of the desired cards. Any key not used will be
 * an empty list. The membership of each card is not checked, so if a card gets inserted into the
 * wrong deck, undefined behavior results. The key 'locations' takes an object of keys representing
 * that villain's locations to overwrite from the defaults. Each value is an object containing keys
 * 'villain-side-cards' and 'hero-side-cards'. These keys associate to lists of strings of card names
 * that should be at that location.
 *
 * If less than the minimum number of required villains is provided. Default ones will be used.
 * These get instantiated the same way as if they were provided with the shorthand method.
 * @return the instantiated board state
 */
function instantiateCustomBoardState(...villainsOrVillainNames) {
    if (villainsOrVillainNames.length > 2) {
        throw new Error("Too many arguments provided");
    }

    const data = fs.readFileSync("game-settings.json", "utf-8");
    const settings = JSON.parse(data);
    const availableVillains = settings["availableVillains"];

    if (
        villainsOrVillainNames.some((v) => {
            return typeof v != "string" && typeof v != "object";
        })
    ) {
        throw new Error("Invalid arguments provided");
    }

    if (
        villainsOrVillainNames
            .filter((v) => {
                return typeof v == "string";
            })
            .some((villainName) => {
                return !availableVillains.includes(villainName);
            })
    ) {
        throw new Error("Invalid arguments provided");
    }

    if (
        villainsOrVillainNames
            .filter((v) => {
                return typeof v == "object";
            })
            .some((villain) => {
                return !villain.hasOwnProperty("villain-name");
            })
    ) {
        throw new Error("Key 'villain-name' not provided with villain definition");
    }

    // Check for duplicates
    const providedVillainNames = villainsOrVillainNames.map((v) => {
        if (typeof v == "object") {
            return v["villain-name"];
        } else {
            return v;
        }
    });
    const duplicates = providedVillainNames.filter(
        (v, index) => providedVillainNames.indexOf(v) !== index
    );
    if (duplicates.length > 0) {
        throw new Error("Duplicate villain names passed");
    }

    const defaultVillainsToAdd = ["Moff Gideon", "General Grievous"].filter((v) => {
        return !providedVillainNames.includes(v);
    });
    const villainsToCreate = villainsOrVillainNames.concat(defaultVillainsToAdd).slice(0, 2);

    const villains = villainsToCreate.map((v) => {
        if (typeof v == "object") {
            return instantiateCustomVillain(v);
        } else {
            return instantiateVillain(v);
        }
    });

    // For each villain, create a unique player id and associate with their
    // villain's custom/default instantiated sector.
    let sectors = {};
    villains.forEach((v, index) => {
        const playerId = "p" + (index + 1);
        sectors[[playerId]] = v;
    });

    return {
        "counter": 0,
        "player-id-in-turn": "p1",
        "sectors": sectors,
    };
}

function instantiateCustomVillain(villainDefinition) {
    // Create default villain definition
    let villainToReturn;
    try {
        villainToReturn = instantiateVillain(villainDefinition["villain-name"]);
    } catch (_) {
        throw new Error("Key 'villain-name' has invalid villain name");
    }

    // Assign non-deck (nor villain name and objective) game board keys
    ["villain-mover-position", "ambition", "credits"].forEach((key) => {
        if (villainDefinition[key]) {
            villainToReturn[[key]] = villainDefinition[key];
        }
    });

    // Overwrite decks and replace with ones provided in custom definition
    try {
        Object.assign(villainToReturn, {
            "hand": (villainDefinition["hand"] || []).map((cardName) => {
                return instantiateCard(villainDefinition["villain-name"], cardName);
            }),
            "villain-deck": (villainDefinition["villain-deck"] || []).map((cardName) => {
                return instantiateCard(villainDefinition["villain-name"], cardName);
            }),
            "villain-discard-pile": (villainDefinition["villain-discard-pile"] || []).map(
                (cardName) => {
                    return instantiateCard(villainDefinition["villain-name"], cardName);
                }
            ),
            "fate-deck": (villainDefinition["fate-deck"] || []).map((cardName) => {
                return instantiateCard(villainDefinition["villain-name"], cardName);
            }),
            "fate-discard-pile": (villainDefinition["fate-discard-pile"] || []).map((cardName) => {
                return instantiateCard(villainDefinition["villain-name"], cardName);
            }),
        });
    } catch (_) {
        throw new Error("Non-existent cards provided");
    }

    // Check that all passed locations are valid
    const villainLocationNames = villainToReturn["locations"].map((loc) => loc["name"]);
    if (
        Object.keys(villainDefinition["locations"] || []).some((loc) => {
            return !villainLocationNames.includes(loc);
        })
    ) {
        throw new Error("Non-existent location specified");
    }

    // Overwrite locations with provided cards
    const updatedLocations = villainToReturn["locations"].map((location) => {
        const locationName = location["name"];
        const passedLocationDict = villainDefinition["locations"] || {};
        const heroSideCardNames =
            (passedLocationDict[[locationName]] || {})["hero-side-cards"] || [];
        const villainSideCardNames =
            (passedLocationDict[[locationName]] || {})["villain-side-cards"] || [];

        let updatedLocation;
        try {
            updatedLocation = Object.assign(location, {
                "hero-side-cards": heroSideCardNames.map((cardName) => {
                    return instantiateCard(villainDefinition["villain-name"], cardName);
                }),
                "villain-side-cards": villainSideCardNames.map((cardName) => {
                    return instantiateCard(villainDefinition["villain-name"], cardName);
                }),
            });
        } catch (_) {
            throw new Error("Non-existent cards provided");
        }

        return updatedLocation;
    });

    Object.assign(villainToReturn, { "locations": updatedLocations });

    return villainToReturn;
}

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

module.exports = { instantiateStartingBoardState, instantiateCustomBoardState };
