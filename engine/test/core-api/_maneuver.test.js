const { instantiateCustomBoardState } = require("../../src/construct");
const { getLocationByName } = require("../../src/core");
const { _maneuver } = require("../../src/core-api");

describe("_maneuver", () => {
    it("throws error on player not owning card", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "locations": {
                    "Nevarro City": {
                        "villain-side-cards": ["Death Troopers"],
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
            _maneuver(board, "p1", "p2c1", "Nevarro City");
        }).toThrow("Player does not own card");
    });

    it("throws error on card not in location", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "hand": ["Death Troopers"],
            },
        ]);

        expect(() => {
            _maneuver(board, "p1", "p1c1", "The Bridge");
        }).toThrow("Card must be at a sector location");
    });

    it("throws error on maneuvering hero side card", () => {
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
            _maneuver(board, "p1", "p1c1", "The Bridge");
        }).toThrow("Card must be on the villain side");
    });

    it("throws error on invalid new location", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "locations": {
                    "Nevarro City": {
                        "villain-side-cards": ["Death Troopers"],
                    },
                },
            },
        ]);

        expect(() => {
            _maneuver(board, "p1", "p1c1", "Tatooine");
        }).toThrow("New location name invalid");
    });

    it("throws error on maneuvering to same location", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "locations": {
                    "Nevarro City": {
                        "villain-side-cards": ["Death Troopers"],
                    },
                },
            },
        ]);

        expect(() => {
            _maneuver(board, "p1", "p1c1", "Nevarro City");
        }).toThrow("Must move to a new location");
    });

    it("succeeds in maneuvering card to new location", () => {
        const startBoard = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "locations": {
                    "Nevarro City": {
                        "villain-side-cards": ["Death Troopers"],
                    },
                },
            },
        ]);

        const board = _maneuver(startBoard, "p1", "p1c1", "The Bridge");

        const nevarroCity = getLocationByName(board, "p1", "Nevarro City");
        const theBridge = getLocationByName(board, "p1", "The Bridge");

        expect(nevarroCity["villain-side-cards"]).toEqual([]);
        expect(theBridge["villain-side-cards"].map((card) => card["name"])).toEqual([
            "Death Troopers",
        ]);
    });
});
