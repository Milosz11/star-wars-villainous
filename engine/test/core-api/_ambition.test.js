const { instantiateCustomBoardState } = require("../../src/construct");
const { getLocationByName, getPlayerById } = require("../../src/core");
const { _ambition } = require("../../src/core-api");

describe("_ambition", () => {
    it("throws when card is not in hand or at location", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-deck": ["Laboratory Samples"],
            },
        ]);

        expect(() => {
            _ambition(board, "p1", "p1c1", { "location": "Nevarro City" });
        }).toThrow("Card not in hand nor location");
    });

    it("throws when player does not own card", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-deck": ["Laboratory Samples"],
            },
            {
                "villain-name": "General Grievous",
                "villain-deck": ["Magna Guard"],
            },
        ]);

        expect(() => {
            _ambition(board, "p1", "p2c1", { "location": "Nevarro City" });
        }).toThrow("Player does not own card");
    });
});

describe("_ambition card", () => {
    it("throws error when non-ambition card", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "hand": ["Stormtroopers"],
            },
        ]);

        expect(() => {
            _ambition(board, "p1", "p1c1", { "location": "Nevarro City" });
        }).toThrow("Card must be an ambition card");
    });

    it("throws error when no location provided", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "ambition": 2,
                "hand": ["Laboratory Samples"],
            },
        ]);

        expect(() => {
            _ambition(board, "p1", "p1c1", {});
        }).toThrow("Invalid location");
    });

    it("throws error when not enough ambition", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "ambition": 0,
                "hand": ["Laboratory Samples"],
            },
        ]);

        expect(() => {
            _ambition(board, "p1", "p1c1", { "location": "Nevarro City" });
        }).toThrow("Not enough ambition");
    });

    it("succeeds - plays card", () => {
        const startBoard = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "ambition": 2,
                "hand": ["Laboratory Samples"],
            },
        ]);

        const board = _ambition(startBoard, "p1", "p1c1", { "location": "Nevarro City" });

        const nevarroCity = getLocationByName(board, "p1", "Nevarro City");
        const villainCards = nevarroCity["villain-side-cards"];
        expect(villainCards.map((card) => card["card-id"])).toEqual(["p1c1"]);

        const p1 = getPlayerById(board, "p1");
        expect(p1["hand"]).toEqual([]);
    });

    it("succeeds - removes ambition", () => {
        const startBoard = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "ambition": 2,
                "hand": ["Laboratory Samples"],
            },
        ]);

        const board = _ambition(startBoard, "p1", "p1c1", { "location": "Nevarro City" });

        const p1 = getPlayerById(board, "p1");
        expect(p1["ambition"]).toEqual(0);
    });
});

describe("_ambition ability", () => {
    it("throws when card not on villain side", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "locations": {
                    "Nevarro City": {
                        "hero-side-cards": ["The Mandalorian"],
                    },
                },
            },
        ]);

        expect(() => {
            _ambition(board, "p1", "p1c1", { "ambition-ability-index": 0 });
        }).toThrow("Card must be on villain side");
    });

    it("throws when no ambition ability", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "locations": {
                    "Nevarro City": {
                        "villain-side-cards": ["Stormtroopers"],
                    },
                },
            },
        ]);

        expect(() => {
            _ambition(board, "p1", "p1c1", { "ambition-ability-index": 0 });
        }).toThrow("Card has no ambition abilities");
    });

    it("throws when no ability index provided", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "locations": {
                    "Nevarro City": {
                        "villain-side-cards": ["The Client"],
                    },
                },
            },
        ]);

        expect(() => {
            _ambition(board, "p1", "p1c1", {});
        }).toThrow("Bad ability index");
    });

    it("throws when ability index out of range", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "locations": {
                    "Nevarro City": {
                        "villain-side-cards": ["The Client"],
                    },
                },
            },
        ]);

        expect(() => {
            _ambition(board, "p1", "p1c1", { "ambition-ability-index": 5 });
        }).toThrow("Bad ability index");
    });

    it("throws when not enough ambition", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "ambition": 0,
                "locations": {
                    "Nevarro City": {
                        "villain-side-cards": ["The Client"],
                    },
                },
            },
        ]);

        expect(() => {
            _ambition(board, "p1", "p1c1", { "ambition-ability-index": 0 });
        }).toThrow("Not enough ambition");
    });

    it.todo("For success test below, test that the ambition ability is activated");

    it("succeeds - activates the ambition ability and removes ambition", () => {
        const startBoard = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "ambition": 2,
                "locations": {
                    "Nevarro City": {
                        "villain-side-cards": ["The Client"],
                    },
                },
            },
        ]);

        const board = _ambition(startBoard, "p1", "p1c1", { "ambition-ability-index": 0 });

        const p1 = getPlayerById(board, "p1");
        expect(p1["ambition"]).toEqual(0);
    });
});
