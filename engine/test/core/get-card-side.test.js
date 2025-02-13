const { instantiateCustomBoardState } = require("../../src/construct");
const { getCardSide } = require("../../src/core");

describe("getCardSide", () => {
    it("throws error if non-existent card", () => {
        const board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "villain-deck": ["Death Troopers"] },
        ]);

        expect(() => {
            const card = getCardSide(board, "p1c32");
        }).toThrow("Non-existent card id");
    });

    it("throws error if card is not at a location", () => {
        const board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "hand": ["Death Troopers"] },
        ]);

        expect(() => {
            const card = getCardSide(board, "p1c1");
        }).toThrow("Card is not at a sector location");
    });

    it("gets the correct side - villain", () => {
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

        expect(getCardSide(board, "p1c1")).toEqual("villain");
    });

    it("gets the correct side - hero", () => {
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

        expect(getCardSide(board, "p1c1")).toEqual("hero");
    });
});
