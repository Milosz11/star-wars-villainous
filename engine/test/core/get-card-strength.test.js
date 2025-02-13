const { instantiateCustomBoardState } = require("../../src/construct");
const { getCardStrength } = require("../../src/core");

describe("getCardStrength", () => {
    it("throws error if non-existent card", () => {
        const board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "villain-deck": ["Death Troopers"] },
        ]);

        expect(() => {
            const card = getCardStrength(board, "p1c32");
        }).toThrow("Non-existent card id");
    });

    it("throws error if card does not have a strength attribute", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "locations": { "Nevarro City": { "villain-side-cards": ["Laboratory Samples"] } },
            },
        ]);

        expect(() => {
            const card = getCardStrength(board, "p1c1");
        }).toThrow("The card does not have a strength attribute");
    });

    it("gets the default strength", () => {
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

        expect(getCardStrength(board, "p1c1")).toEqual(2);
    });

    it.todo("test additional strength");

    it.todo("test temporary strength");
});
