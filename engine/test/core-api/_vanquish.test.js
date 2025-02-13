const { instantiateCustomBoardState } = require("../../src/construct");
const { getPlayerById, getLocationByName } = require("../../src/core");
const { _vanquish } = require("../../src/core-api");

describe("_vanquish", () => {
    it("throws error on non-existent playerId", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "locations": {
                    "Nevarro City": {
                        "hero-side-cards": ["The Mandalorian"],
                        "villain-side-cards": [
                            "Death Troopers",
                            "Death Troopers",
                            "Stormtroopers",
                            "The Client",
                        ],
                    },
                },
            },
        ]);

        expect(() => {
            _vanquish(board, "a1", "p1c1", ["p1c2", "p1c3"], {});
        }).toThrow("Non-existent player id");
    });

    it("throws error on non-existent card id", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "locations": {
                    "Nevarro City": {
                        "hero-side-cards": ["The Mandalorian"],
                        "villain-side-cards": ["Death Troopers", "Death Troopers"],
                    },
                },
            },
        ]);

        expect(() => {
            _vanquish(board, "p1", "p1c1", ["p1c7", "p1c3"], {});
        }).toThrow("Non-existent card id");
    });

    it("throws error on using other players cards 1", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "locations": {
                    "Nevarro City": {
                        "hero-side-cards": ["The Mandalorian"],
                        "villain-side-cards": [
                            "Death Troopers",
                            "Death Troopers",
                            "Stormtroopers",
                            "The Client",
                        ],
                    },
                },
            },
            {
                "villain-name": "General Grievous",
                "locations": {
                    "Florrum": {
                        "villain-side-cards": ["Magna Guard"],
                    },
                },
            },
        ]);

        expect(() => {
            _vanquish(board, "p1", "p1c1", ["p2c1", "p1c3"], {});
        }).toThrow("Player does not own card");
    });

    it("throws error on using other players cards 2", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "locations": {
                    "Nevarro City": {
                        "hero-side-cards": ["The Mandalorian"],
                        "villain-side-cards": [
                            "Death Troopers",
                            "Death Troopers",
                            "Stormtroopers",
                            "The Client",
                        ],
                    },
                },
            },
            {
                "villain-name": "General Grievous",
                "locations": {
                    "Florrum": {
                        "hero-side-cards": ["Anakin Skywalker"],
                    },
                },
            },
        ]);

        expect(() => {
            _vanquish(board, "p1", "p2c1", ["p1c2", "p1c3"], {});
        }).toThrow("Player does not own card");
    });

    it("throws error if a card does not have a strength attribute (and not vehicle)", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-mover-location": "Nevarro City",
                "locations": {
                    "Nevarro City": {
                        "hero-side-cards": ["The Mandalorian"],
                        "villain-side-cards": ["Laboratory Samples"],
                    },
                },
            },
        ]);

        expect(() => {
            _vanquish(board, "p1", "p1c1", ["p1c2"], {});
        }).toThrow("The cards do not have a strength attribute");
    });

    it("throws error on vanquished not on hero side", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "locations": {
                    "Nevarro City": {
                        "villain-side-cards": ["Death Troopers", "Death Troopers", "Stormtroopers"],
                    },
                },
            },
        ]);

        expect(() => {
            _vanquish(board, "p1", "p1c1", ["p1c2", "p1c3"], {});
        }).toThrow("The card to be vanquished is not on the hero side");
    });

    it("throws error on vanquishers not on villain side", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "locations": {
                    "Nevarro City": {
                        "hero-side-cards": ["The Mandalorian", "Koska Reeves"],
                    },
                },
            },
        ]);

        expect(() => {
            _vanquish(board, "p1", "p1c1", ["p1c2"], {});
        }).toThrow("The vanquishing cards must be on the villain side");
    });

    it("throws error on vanquishers and vanquished not in same location (excluding cards that can vanquish adjacent locations)", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "locations": {
                    "Tython": {
                        "villain-side-cards": ["Dark Troopers"],
                    },
                    "The Bridge": {
                        "hero-side-cards": ["The Mandalorian"],
                    },
                },
            },
        ]);

        expect(() => {
            _vanquish(board, "p1", "p1c2", ["p1c1"], {});
        }).toThrow("All vanquishers are not at the location of the card to be vanquished");
    });

    it.todo("test vanquish with a card that can vanquish adjacent location");

    it("throws error on vanquishers not having enough strength to vanquish hero-side card", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "locations": {
                    "Nevarro City": {
                        "hero-side-cards": ["The Mandalorian"],
                        "villain-side-cards": ["Death Troopers", "Stormtroopers"],
                    },
                },
            },
        ]);

        expect(() => {
            _vanquish(board, "p1", "p1c1", ["p1c2", "p1c3"], {});
        }).toThrow("The villain-side cards are not strong enough to defeat the hero-side card");
    });

    it("hero-side card is moved to fate discard pile", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-mover-location": "Nevarro City",
                "locations": {
                    "Nevarro City": {
                        "hero-side-cards": ["The Mandalorian"],
                        "villain-side-cards": ["Death Troopers", "Death Troopers"],
                    },
                },
            },
        ]);

        const newBoard = _vanquish(board, "p1", "p1c1", ["p1c2", "p1c3"], {});
        const player = getPlayerById(newBoard, "p1");
        const location = getLocationByName(newBoard, "p1", "Nevarro City");

        expect(location["hero-side-cards"]).toHaveLength(0);
        expect(player["fate-discard-pile"]).toHaveLength(1);
        expect(player["fate-discard-pile"].map((c) => c["name"])).toEqual(["The Mandalorian"]);
    });

    it("villain-side cards are moved to villain discard pile (excluding cards that can be moved back to hand)", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-mover-location": "Nevarro City",
                "locations": {
                    "Nevarro City": {
                        "hero-side-cards": ["The Mandalorian"],
                        "villain-side-cards": ["Death Troopers", "Death Troopers"],
                    },
                },
            },
        ]);

        const newBoard = _vanquish(board, "p1", "p1c1", ["p1c2", "p1c3"], {});
        const player = getPlayerById(newBoard, "p1");
        const location = getLocationByName(newBoard, "p1", "Nevarro City");

        expect(location["villain-side-cards"]).toHaveLength(0);
        expect(player["villain-discard-pile"]).toHaveLength(2);
        expect(player["villain-discard-pile"].map((c) => c["name"])).toEqual([
            "Death Troopers",
            "Death Troopers",
        ]);
    });

    it.todo(
        "test vehicle vanquish (doesn't throw error that they don't have a strength attribute and they get discarded"
    );

    it.todo("on-vanquish is called on other cards");
});
