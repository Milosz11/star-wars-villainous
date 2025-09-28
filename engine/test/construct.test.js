const { instantiateStartingBoardState, instantiateCustomBoardState } = require("../src/construct");
const { getPlayerById, getLocationByName } = require("../src/core");

const availableVillains = ["Moff Gideon", "General Grievous", "Darth Vader"];

describe("instantiateStartingBoardState throws Error on bad input", () => {
    it("no availableVillains array passed", () => {
        expect(() => {
            instantiateStartingBoardState();
        }).toThrow("'villainNames' is a falsy value. Should be a list of strings");
    });

    it("when invalid argument is passed", () => {
        expect(() => {
            instantiateStartingBoardState([availableVillains[0], "non-existent villain"]);
        }).toThrow("Bad villain name value");
    });

    it("with too little number of villains", () => {
        expect(() => {
            instantiateStartingBoardState([availableVillains[0]]);
        }).toThrow("Improper length of villain names");
    });

    it("with too many number of villains", () => {
        expect(() => {
            instantiateStartingBoardState([
                availableVillains[0],
                availableVillains[1],
                availableVillains[2],
            ]);
        }).toThrow("Improper length of villain names");
    });

    it("seed length invalid type", () => {
        expect(() => {
            instantiateStartingBoardState([availableVillains[0], availableVillains[1]], {
                "seed": 3,
            });
        }).toThrow("Invalid seed; should be a string with length >= 8");
    });

    it("seed length 0", () => {
        expect(() => {
            instantiateStartingBoardState([availableVillains[0], availableVillains[1]], {
                "seed": "",
            });
        }).toThrow("Invalid seed; should be a string with length >= 8");
    });
});

describe("instantiateStartingBoardState properly constructs initial game board", () => {
    const board = instantiateStartingBoardState([availableVillains[0], availableVillains[1]]);

    it("has proper first level keys", () => {
        expect(board).toHaveProperty("player-id-in-turn", "p1");
        expect(board).toHaveProperty("counter", 1);
        expect(board).toHaveProperty("sectors", expect.any(Object));
        expect(board).toHaveProperty("seed", expect.any(String));
    });

    it("has proper keys in a sector", () => {
        const sector = board["sectors"]["p1"];
        expect(sector).toHaveProperty("previous-villain-mover-location");
        expect(sector).toHaveProperty("villain-mover-location");
        expect(sector).toHaveProperty("ambition", 0);
        expect(sector).toHaveProperty("credits", 0);
        expect(sector).toHaveProperty("locations");
        expect(sector).toHaveProperty("hand", []);
        expect(sector).toHaveProperty("villain-deck");
        expect(sector).toHaveProperty("villain-discard-pile", []);
        expect(sector).toHaveProperty("fate-deck");
        expect(sector).toHaveProperty("fate-discard-pile", []);
    });

    it("has proper keys in a location", () => {
        const location = board["sectors"]["p1"]["locations"][0];
        expect(location).toHaveProperty("name", expect.any(String));
        expect(location).toHaveProperty("actions", expect.any(Array));
        expect(location).toHaveProperty("taken-actions", expect.any(Array));
        expect(location).toHaveProperty("hero-side-cards", expect.any(Array));
        expect(location).toHaveProperty("villain-side-cards", expect.any(Array));
    });

    it("has proper keys in a villain card", () => {
        const villainCard = board["sectors"]["p1"]["villain-deck"][0];
        expect(villainCard).toHaveProperty("name", expect.any(String));
        expect(villainCard).toHaveProperty("card-type", expect.any(String));
    });

    it("has proper keys in a fate card", () => {
        const fateCard = board["sectors"]["p1"]["fate-deck"][0];
        expect(fateCard).toHaveProperty("name", expect.any(String));
        expect(fateCard).toHaveProperty("card-type", expect.any(String));
        expect(fateCard).toHaveProperty("description", expect.any(String));
        expect(fateCard).toHaveProperty("on-play-card", expect.any(Function));
    });

    it("ally card type gets specific keys", () => {
        const filteredAllyCard = board["sectors"]["p1"]["villain-deck"].filter((card) => {
            return card["card-type"] == "Ally";
        })[0];

        expect(filteredAllyCard).toHaveProperty("attached-cards", expect.any(Array));
        expect(filteredAllyCard).toHaveProperty("additional-strength", expect.any(Number));
    });

    it("hero card type gets specific keys", () => {
        const filteredHeroCard = board["sectors"]["p1"]["fate-deck"].filter((card) => {
            return card["card-type"] == "Hero";
        })[0];

        expect(filteredHeroCard).toHaveProperty("attached-cards", expect.any(Array));
        expect(filteredHeroCard).toHaveProperty("additional-strength", expect.any(Number));
    });

    it("non-ally, non-hero card type does not get ally/hero specific keys", () => {
        const filteredAllyCard = board["sectors"]["p1"]["villain-deck"].filter((card) => {
            return card["card-type"] == "Effect";
        })[0];
        const filteredHeroCard = board["sectors"]["p1"]["fate-deck"].filter((card) => {
            return card["card-type"] == "Effect";
        })[0];

        expect(filteredAllyCard).not.toHaveProperty("attached-cards", expect.any(Array));
        expect(filteredAllyCard).not.toHaveProperty("additional-strength", expect.any(Number));

        expect(filteredHeroCard).not.toHaveProperty("attached-cards", expect.any(Array));
        expect(filteredHeroCard).not.toHaveProperty("additional-strength", expect.any(Number));
    });

    it("every villain has a unique player id", () => {
        const playerIdKeys = Object.keys(board["sectors"]);
        const playerIdsInVillains = Object.values(board["sectors"]).map(
            (sector) => sector["player-id"]
        );
        const playerIdKeysSet = new Set(playerIdKeys);
        const playerIdsInVillainsSet = new Set(playerIdsInVillains);

        expect(playerIdKeysSet.size).toEqual(2);
        expect(playerIdsInVillainsSet.size).toEqual(2);
        expect(playerIdKeys).toEqual(playerIdsInVillains);
    });

    it("every card has a unique id", () => {
        let cardList = [];
        for (const v of Object.values(board["sectors"])) {
            cardList = cardList.concat(v["villain-deck"]);
            cardList = cardList.concat(v["fate-deck"]);
        }

        const doAllHaveIds = cardList.every((card) => {
            return card.hasOwnProperty("card-id");
        });
        expect(doAllHaveIds).toBeTruthy();

        const cardIdList = cardList.map((card) => {
            return card["card-id"];
        });

        const cardIdSet = new Set(cardIdList);

        // FIXME this currently fails because General Grievous' definition is not complete.
        // (30 villain cards + 15 fate cards) * 2 villains
        expect(cardIdSet.size).toEqual(90);
    });
});

describe("instantiateCustomBoardState throws Error on invalid arguments", () => {
    it("more than 2 villains provided", () => {
        expect(() => {
            instantiateCustomBoardState(["Moff Gideon", "General Grievous", "Darth Vader"]);
        }).toThrow("Too many arguments provided");
    });

    it("wrong types", () => {
        expect(() => {
            instantiateCustomBoardState(["Moff Gideon", 0]);
        }).toThrow("Invalid arguments provided");
    });

    it("bad villain name", () => {
        expect(() => {
            instantiateCustomBoardState(["Moff"]);
        }).toThrow("Invalid arguments provided");
    });

    it("villain object definition does not have 'villain-name' key", () => {
        expect(() => {
            instantiateCustomBoardState([{ "ambition": 3 }]);
        }).toThrow("Key 'villain-name' not provided with villain definition");
    });

    it("'villain-name' key has invalid villain name", () => {
        expect(() => {
            instantiateCustomBoardState([{ "villain-name": "Revan" }]);
        }).toThrow("Key 'villain-name' has invalid villain name");
    });

    it("bad type for a key like ambition", () => {
        expect(() => {
            instantiateCustomBoardState([
                {
                    "villain-name": "Moff Gideon",
                    "ambition": "3",
                    "villain-deck": ["Hello There"],
                },
            ]);
        }).toThrow("Passed keys have bad type");
    });

    it("non-existent card given to a villain", () => {
        expect(() => {
            instantiateCustomBoardState([
                {
                    "villain-name": "Moff Gideon",
                    "villain-deck": ["Hello There"],
                },
            ]);
        }).toThrow("Non-existent cards provided");
    });

    it("non-existent location specified", () => {
        expect(() => {
            instantiateCustomBoardState([
                {
                    "villain-name": "Moff Gideon",
                    "locations": {
                        "not a real place": {
                            "villain-side-cards": ["Dark Troopers"],
                        },
                    },
                },
            ]);
        }).toThrow("Non-existent location specified");
    });

    it("non-existent card given in location", () => {
        expect(() => {
            instantiateCustomBoardState([
                {
                    "villain-name": "Moff Gideon",
                    "locations": {
                        "Nevarro City": {
                            "villain-side-cards": ["It's Over Anakin"],
                        },
                    },
                },
            ]);
        }).toThrow("Non-existent cards provided");
    });

    it("bad action at location", () => {
        expect(() => {
            instantiateCustomBoardState([
                {
                    "villain-name": "Moff Gideon",
                    "locations": {
                        "Nevarro City": {
                            "taken-actions": ["Fate"],
                        },
                    },
                },
            ]);
        }).toThrow("Action does not exists for this location");
    });

    it("seed length invalid type", () => {
        expect(() => {
            instantiateCustomBoardState([], {
                "seed": 3,
            });
        }).toThrow("Invalid seed; should be a string with length >= 8");
    });

    it("seed length 0", () => {
        expect(() => {
            instantiateCustomBoardState([], {
                "seed": "",
            });
        }).toThrow("Invalid seed; should be a string with length >= 8");
    });
});

describe("instantiateCustomBoardState properly constructs initial game board", () => {
    const board = instantiateCustomBoardState();

    it("has proper first level keys", () => {
        expect(board).toHaveProperty("player-id-in-turn", "p1");
        expect(board).toHaveProperty("counter", 1);
        expect(board).toHaveProperty("sectors", expect.any(Object));
        expect(board).toHaveProperty("seed", expect.any(String));
    });
});

describe("instantiateCustomBoardState correctly instantiates using string shorthand", () => {
    const board = instantiateCustomBoardState(["Moff Gideon"]);
    const villain = board["sectors"]["p1"];

    it("credit amounts are not altered", () => {
        expect(villain["credits"]).toBe(0);
    });

    it("villain gets a full villain and fate deck", () => {
        expect(villain["villain-deck"]).toHaveLength(30);
        expect(villain["fate-deck"]).toHaveLength(15);
    });

    it("every villain has a unique player id", () => {
        const playerIdKeys = Object.keys(board["sectors"]);
        const playerIdsInVillains = Object.values(board["sectors"]).map(
            (sector) => sector["player-id"]
        );
        const playerIdKeysSet = new Set(playerIdKeys);
        const playerIdsInVillainsSet = new Set(playerIdsInVillains);

        expect(playerIdKeysSet.size).toEqual(2);
        expect(playerIdsInVillainsSet.size).toEqual(2);
        expect(playerIdKeys).toEqual(playerIdsInVillains);
    });
});

describe("instantiateCustomBoardState nonspecified villains are treated the same as shorthand", () => {
    const villain = instantiateCustomBoardState(["General Grievous"])["sectors"]["p2"];

    it("credit amounts are not altered", () => {
        expect(villain["credits"]).toBe(0);
    });

    it("villain gets a full villain and fate deck", () => {
        expect(villain["villain-deck"]).toHaveLength(30);
        expect(villain["fate-deck"]).toHaveLength(15);
    });
});

describe("instantiateCustomBoardState correctly instantiates given custom villain definitions", () => {
    it("credit amounts are not altered", () => {
        const board = instantiateCustomBoardState([{ "villain-name": "Moff Gideon" }]);

        expect(board["sectors"]["p1"]["credits"]).toBe(0);
    });

    it("a key is set if passed (credits are set explicitly)", () => {
        const board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "credits": 3 },
        ]);

        expect(board["sectors"]["p1"]["credits"]).toBe(3);
    });

    it("villain mover locations set properly", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "previous-villain-mover-location": "The Bridge",
                "villain-mover-location": "Nevarro City",
            },
        ]);

        const player = getPlayerById(board, "p1");

        expect(player["previous-villain-mover-location"]).toEqual("The Bridge");
        expect(player["villain-mover-location"]).toEqual("Nevarro City");
    });

    it("villain's decks are empty", () => {
        const board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "credits": 3 },
        ]);
        const villain = board["sectors"]["p1"];

        expect(villain["villain-deck"]).toHaveLength(0);
        expect(villain["villain-discard-pile"]).toHaveLength(0);
        expect(villain["fate-deck"]).toHaveLength(0);
        expect(villain["fate-discard-pile"]).toHaveLength(0);
        expect(villain["hand"]).toHaveLength(0);
    });

    it("doesn't apply a non-deck or location key which is not credits, ambition, or villain-mover-location", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "player-id": "43",
            },
        ]);

        expect(board["sectors"]["p1"]["player-id"]).not.toEqual("43");
    });

    it("every villain has a unique player id", () => {
        const board = instantiateCustomBoardState([{ "villain-name": "Moff Gideon" }]);
        const playerIdKeys = Object.keys(board["sectors"]);
        const playerIdsInVillains = Object.values(board["sectors"]).map(
            (sector) => sector["player-id"]
        );
        const playerIdKeysSet = new Set(playerIdKeys);
        const playerIdsInVillainsSet = new Set(playerIdsInVillains);

        expect(playerIdKeysSet.size).toEqual(2);
        expect(playerIdsInVillainsSet.size).toEqual(2);
        expect(playerIdKeys).toEqual(playerIdsInVillains);
    });

    it("every card has a unique card id", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "locations": {
                    "Nevarro City": {
                        "villain-side-cards": ["The Client", "Doctor Pershing"],
                        "hero-side-cards": ["Fennec Shand"],
                    },
                    "The Bridge": {
                        "villain-side-cards": ["Dark Troopers", "Dark Troopers"],
                        "hero-side-cards": ["The Mandalorian", "Bo-Katan Kryze"],
                    },
                },
                "hand": ["Dark Troopers", "Death Troopers", "Darksaber"],
                "villain-deck": ["Stormtroopers", "Beskar", "Imperial Light Cruiser"],
                "villain-discard-pile": ["Death Troopers", "Stormtroopers"],
                "fate-deck": ["The Return of Fett", "The Jedi", "The Bounty"],
                "fate-discard-pile": ["Koska Reeves", "Unexpected Help"],
            },
        ]);

        let cardList = [];
        for (const v of Object.values(board["sectors"])) {
            for (const loc of v["locations"]) {
                cardList = cardList.concat(loc["hero-side-cards"]);
                cardList = cardList.concat(loc["villain-side-cards"]);
            }
            cardList = cardList.concat(v["hand"]);
            cardList = cardList.concat(v["villain-deck"]);
            cardList = cardList.concat(v["villain-discard-pile"]);
            cardList = cardList.concat(v["fate-deck"]);
            cardList = cardList.concat(v["fate-discard-pile"]);
        }

        const doAllHaveIds = cardList.every((card) => {
            return card.hasOwnProperty("card-id");
        });
        expect(doAllHaveIds).toBeTruthy();

        const cardIdList = cardList.map((card) => {
            return card["card-id"];
        });
        const cardIdSet = new Set(cardIdList);

        // FIXME this currently fails because General Grievous' definition is not complete.
        // (30 villain cards + 15 fate cards) + 20 cards in Moff Gideon's custom definition above
        expect(cardIdSet.size).toEqual(65);
    });
});

describe("instantiateCustomBoardState correctly uses shorthand for cards", () => {
    it("villains' decks contain only what was passed 1", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-deck": ["The Client"],
            },
        ]);
        const villain = board["sectors"]["p1"];

        expect(villain["villain-deck"]).toHaveLength(1);
        expect(villain["villain-discard-pile"]).toHaveLength(0);
        expect(villain["fate-deck"]).toHaveLength(0);
        expect(villain["fate-discard-pile"]).toHaveLength(0);
        expect(villain["hand"]).toHaveLength(0);
    });

    it("villains' decks contain only what was passed 2", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-deck": ["The Client", "Dark Troopers"],
                "villain-discard-pile": ["Death Troopers"],
                "fate-deck": ["The Mandalorian"],
                "hand": ["Death Troopers", "Stormtroopers"],
            },
        ]);
        const villain = board["sectors"]["p1"];

        expect(villain["villain-deck"]).toHaveLength(2);
        expect(villain["villain-discard-pile"]).toHaveLength(1);
        expect(villain["fate-deck"]).toHaveLength(1);
        expect(villain["fate-discard-pile"]).toHaveLength(0);
        expect(villain["hand"]).toHaveLength(2);
    });

    it("shorthand properly creates a card from definition", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "hand": ["Dark Troopers", "Darksaber"],
            },
        ]);
        const villain = board["sectors"]["p1"];

        expect(villain["hand"][0]).toHaveProperty("name", "Dark Troopers");
        expect(villain["hand"][0]).toHaveProperty("card-type", "Ally");
        expect(villain["hand"][0]).toHaveProperty("strength", 5);
        expect(villain["hand"][1]).toHaveProperty("name", "Darksaber");
        expect(villain["hand"][1]).toHaveProperty("card-type", "Item");
    });
});

describe("instantiateCustomBoardState properly creates locations", () => {
    it("location has cards added to it", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "locations": {
                    "The Bridge": {
                        "villain-side-cards": ["Dark Troopers"],
                        "hero-side-cards": ["The Mandalorian", "Bo-Katan Kryze"],
                    },
                },
            },
        ]);
        const theBridge = board["sectors"]["p1"]["locations"].find((loc) => {
            return loc["name"] == "The Bridge";
        });

        expect(theBridge["villain-side-cards"]).toHaveLength(1);
        expect(theBridge["hero-side-cards"]).toHaveLength(2);
    });

    it("cards at location are instaniated", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "locations": {
                    "The Bridge": {
                        "villain-side-cards": ["Dark Troopers"],
                        "hero-side-cards": ["The Mandalorian", "Bo-Katan Kryze"],
                    },
                },
            },
        ]);
        const theBridge = board["sectors"]["p1"]["locations"].find((loc) => {
            return loc["name"] == "The Bridge";
        });

        expect(theBridge["villain-side-cards"][0]).toHaveProperty("name", "Dark Troopers");
        expect(theBridge["villain-side-cards"][0]).toHaveProperty("card-type", "Ally");
        expect(theBridge["hero-side-cards"][0]).toHaveProperty("name", "The Mandalorian");
        expect(theBridge["hero-side-cards"][0]).toHaveProperty("card-type", "Hero");
        expect(theBridge["hero-side-cards"][1]).toHaveProperty("name", "Bo-Katan Kryze");
        expect(theBridge["hero-side-cards"][1]).toHaveProperty("strength", 3);
    });

    it("taken actions are added to location", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "locations": {
                    "The Bridge": {
                        "taken-actions": ["Ambition", "Discard Cards"],
                    },
                },
            },
        ]);

        const theBridge = getLocationByName(board, "p1", "The Bridge");

        expect(theBridge["taken-actions"]).toEqual(["Ambition", "Discard Cards"]);
    });
});
