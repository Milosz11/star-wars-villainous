const { instantiateCustomBoardState } = require("../../src/construct");
const { getCardLocation } = require("../../src/core");

describe("getCardLocation", () => {
    it("throws error if non-existent card", () => {
        const board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "villain-deck": ["Death Troopers"] },
        ]);

        expect(() => {
            const card = getCardLocation(board, "p1c32");
        }).toThrow("Non-existent card id");
    });

    it("returns null if card is not at a location", () => {
        const board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "hand": ["Death Troopers"] },
        ]);

        const shouldBeNull = getCardLocation(board, "p1c1");

        expect(shouldBeNull).toBeNull();
    });

    it("gets the correct location", () => {
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

        const location = getCardLocation(board, "p1c1");
        expect(location).toHaveProperty("name", "Nevarro City");
        expect(location).toHaveProperty("taken-actions", []);
        expect(location).toHaveProperty("actions", [
            "Collect 2 Credits",
            "Ambition",
            "Play a Card",
            "Vanquish",
        ]);
        expect(location).toHaveProperty("villain-side-cards");
        expect(location).toHaveProperty("hero-side-cards");
    });
});
