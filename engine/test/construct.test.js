const fs = require("node:fs");
const { instantiateStartingBoardState, instantiateCustomBoardState } = require("../src/construct");

const data = fs.readFileSync("game-settings.json", "utf-8");
const settings = JSON.parse(data);
const availableVillains = settings["availableVillains"];

describe("instantiateStartingBoardState throws Error on bad input", () => {
    it("when invalid argument is passed", () => {
        expect(() => {
            instantiateStartingBoardState(availableVillains[0], "non-existent villain");
        }).toThrow("Bad villain name value");
    });

    it("with too little number of villains", () => {
        expect(() => {
            instantiateStartingBoardState(availableVillains[0]);
        }).toThrow("Improper length of villain names");
    });

    it("with too many number of villains", () => {
        expect(() => {
            instantiateStartingBoardState(
                availableVillains[0],
                availableVillains[1],
                availableVillains[2]
            );
        }).toThrow("Improper length of villain names");
    });

    it("when duplicate villain names are passed", () => {
        expect(() => {
            instantiateStartingBoardState(availableVillains[0], availableVillains[0]);
        }).toThrow("Duplicate villain names passed");
    });
});

describe("instantiateStartingBoardState properly constructs initial game board", () => {
    const board = instantiateStartingBoardState(availableVillains[0], availableVillains[1]);

    it("has proper first level keys", () => {
        expect(board).toHaveProperty("player-id-in-turn", "p1");
        expect(board).toHaveProperty("counter", 0);
        expect(board).toHaveProperty("sectors", expect.any(Object));
    });

    it("has proper keys in a sector", () => {
        const sector = board["sectors"]["p1"];
        expect(sector).toHaveProperty("villain-mover-position", 0);
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
});

describe("instantiateCustomBoardState throws Error on invalid arguments", () => {
    it("more than 2 villains provided", () => {
        expect(() => {
            instantiateCustomBoardState("Moff Gideon", "General Grievous", "Darth Vader");
        }).toThrow("Too many arguments provided");
    });

    it("wrong types", () => {
        expect(() => {
            instantiateCustomBoardState("Moff Gideon", 0);
        }).toThrow("Invalid arguments provided");
    });

    it("bad villain name", () => {
        expect(() => {
            instantiateCustomBoardState("Moff");
        }).toThrow("Invalid arguments provided");
    });

    it("villain object definition does not have 'villain-name' key", () => {
        expect(() => {
            instantiateCustomBoardState({ "ambition": 3 });
        }).toThrow("Key 'villain-name' not provided with villain definition");
    });

    it("'villain-name' key has invalid villain name", () => {
        expect(() => {
            instantiateCustomBoardState({ "villain-name": "Revan" });
        }).toThrow("Key 'villain-name' has invalid villain name");
    });

    it("duplicate villains provided 1", () => {
        expect(() => {
            instantiateCustomBoardState("Moff Gideon", "Moff Gideon");
        }).toThrow("Duplicate villain names passed");
    });

    it("duplicate villains provided 2", () => {
        expect(() => {
            instantiateCustomBoardState("Moff Gideon", { "villain-name": "Moff Gideon" });
        }).toThrow("Duplicate villain names passed");
    });

    it("bad type for a key like ambition", () => {
        expect(() => {
            instantiateCustomBoardState({
                "villain-name": "Moff Gideon",
                "ambition": "3",
                "villain-deck": ["Hello There"],
            });
        }).toThrow("Passed keys have bad type");
    });

    it("non-existent card given to a villain", () => {
        expect(() => {
            instantiateCustomBoardState({
                "villain-name": "Moff Gideon",
                "villain-deck": ["Hello There"],
            });
        }).toThrow("Non-existent cards provided");
    });

    it("non-existent location specified", () => {
        expect(() => {
            instantiateCustomBoardState({
                "villain-name": "Moff Gideon",
                "locations": {
                    "not a real place": {
                        "villain-side-cards": ["Dark Troopers"],
                    },
                },
            });
        }).toThrow("Non-existent location specified");
    });

    it("non-existent card given in location", () => {
        expect(() => {
            instantiateCustomBoardState({
                "villain-name": "Moff Gideon",
                "locations": {
                    "Nevarro City": {
                        "villain-side-cards": ["It's Over Anakin"],
                    },
                },
            });
        }).toThrow("Non-existent cards provided");
    });
});

describe("instantiateCustomBoardState correctly instantiates using string shorthand", () => {
    const villain = instantiateCustomBoardState("Moff Gideon")["sectors"]["p1"];

    it("credit amounts are not altered", () => {
        expect(villain["credits"]).toBe(0);
    });

    it("villain gets a full villain and fate deck", () => {
        expect(villain["villain-deck"]).toHaveLength(30);
        expect(villain["fate-deck"]).toHaveLength(15);
    });

    it.todo("every card has a unique id");

    it.todo("decks are shuffled");
});

describe("instantiateCustomBoardState nonspecified villains are treated the same as shorthand", () => {
    const villain = instantiateCustomBoardState("General Grievous")["sectors"]["p2"];

    it("credit amounts are not altered", () => {
        expect(villain["credits"]).toBe(0);
    });

    it("villain gets a full villain and fate deck", () => {
        expect(villain["villain-deck"]).toHaveLength(30);
        expect(villain["fate-deck"]).toHaveLength(15);
    });

    it.todo("every card has a unique id");

    it.todo("decks are shuffled");
});

describe("instantiateCustomBoardState correctly instantiates given custom villain definitions", () => {
    it.todo("string and object are treated the same");

    it("credit amounts are not altered", () => {
        const board = instantiateCustomBoardState({ "villain-name": "Moff Gideon" });

        expect(board["sectors"]["p1"]["credits"]).toBe(0);
    });

    it("a key is set if passed (credits are set explicitly)", () => {
        const board = instantiateCustomBoardState({ "villain-name": "Moff Gideon", "credits": 3 });

        expect(board["sectors"]["p1"]["credits"]).toBe(3);
    });

    it("villain's decks are empty", () => {
        const board = instantiateCustomBoardState({ "villain-name": "Moff Gideon", "credits": 3 });
        const villain = board["sectors"]["p1"];

        expect(villain["villain-deck"]).toHaveLength(0);
        expect(villain["villain-discard-pile"]).toHaveLength(0);
        expect(villain["fate-deck"]).toHaveLength(0);
        expect(villain["fate-discard-pile"]).toHaveLength(0);
        expect(villain["hand"]).toHaveLength(0);
    });

    it.todo("every card has a unique id");
});

describe("instantiateCustomBoardState correctly uses shorthand for cards", () => {
    it("villains' decks contain only what was passed 1", () => {
        const board = instantiateCustomBoardState({
            "villain-name": "Moff Gideon",
            "villain-deck": ["The Client"],
        });
        const villain = board["sectors"]["p1"];

        expect(villain["villain-deck"]).toHaveLength(1);
        expect(villain["villain-discard-pile"]).toHaveLength(0);
        expect(villain["fate-deck"]).toHaveLength(0);
        expect(villain["fate-discard-pile"]).toHaveLength(0);
        expect(villain["hand"]).toHaveLength(0);
    });

    it("villains' decks contain only what was passed 2", () => {
        const board = instantiateCustomBoardState({
            "villain-name": "Moff Gideon",
            "villain-deck": ["The Client", "Dark Troopers"],
            "villain-discard-pile": ["Death Troopers"],
            "fate-deck": ["The Mandalorian"],
            "hand": ["Death Troopers", "Stormtroopers"],
        });
        const villain = board["sectors"]["p1"];

        expect(villain["villain-deck"]).toHaveLength(2);
        expect(villain["villain-discard-pile"]).toHaveLength(1);
        expect(villain["fate-deck"]).toHaveLength(1);
        expect(villain["fate-discard-pile"]).toHaveLength(0);
        expect(villain["hand"]).toHaveLength(2);
    });

    it("shorthand properly creates a card from definition", () => {
        const board = instantiateCustomBoardState({
            "villain-name": "Moff Gideon",
            "hand": ["Dark Troopers", "Darksaber"],
        });
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
        const board = instantiateCustomBoardState({
            "villain-name": "Moff Gideon",
            "locations": {
                "The Bridge": {
                    "villain-side-cards": ["Dark Troopers"],
                    "hero-side-cards": ["The Mandalorian", "Bo-Katan Kryze"],
                },
            },
        });
        const theBridge = board["sectors"]["p1"]["locations"].find((loc) => {
            return loc["name"] == "The Bridge";
        });

        expect(theBridge["villain-side-cards"]).toHaveLength(1);
        expect(theBridge["hero-side-cards"]).toHaveLength(2);
    });

    it("cards at location are instaniated", () => {
        const board = instantiateCustomBoardState({
            "villain-name": "Moff Gideon",
            "locations": {
                "The Bridge": {
                    "villain-side-cards": ["Dark Troopers"],
                    "hero-side-cards": ["The Mandalorian", "Bo-Katan Kryze"],
                },
            },
        });
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
});
