const { instantiateCustomBoardState } = require("../../src/construct");
const { getCardById } = require("../../src/core");

describe("getCardById", () => {
    it("throws error in id not a string", () => {
        const board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "villain-deck": ["Death Troopers"] },
        ]);

        expect(() => {
            const card = getCardById(board, 12);
        }).toThrow("Id must be a string");
    });

    it("throws error on non-existent card id", () => {
        const board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "villain-deck": ["Death Troopers"] },
        ]);

        expect(() => {
            const card = getCardById(board, "p1c12");
        }).toThrow("Non-existent card id");
    });

    it("gets the proper card 1", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-deck": ["Death Troopers", "The Client", "Doctor Pershing"],
            },
        ]);

        const card = getCardById(board, "p1c3");

        expect(card).toHaveProperty("name", "Doctor Pershing");
    });

    it("gets the proper card 2", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-deck": ["Death Troopers", "The Client", "Doctor Pershing"],
            },
            {
                "villain-name": "General Grievous",
                "villain-deck": ["Magna Guard", "Droidekas", "Soulless One"],
                "fate-deck": ["Anakin Skywalker"],
            },
        ]);

        const card = getCardById(board, "p2c4");

        expect(card).toHaveProperty("name", "Anakin Skywalker");
    });
});
