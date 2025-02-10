const { instantiateCustomBoardState } = require("../../src/construct");
const { spendCredits, getPlayerById } = require("../../src/core");

describe("spendCredits", () => {
    it("throws error on non-existent player id", () => {
        const board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "credits": 5 },
        ]);

        expect(() => {
            const newBoard = spendCredits(board, "h3", 3);
        }).toThrow("Non-existent player id");
    });

    it("throws error when credits is negative", () => {
        const board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "credits": 5 },
        ]);

        expect(() => {
            const newBoard = spendCredits(board, "p1", -2);
        }).toThrow("Credits must be non-negative");
    });

    it("throws error when credits is not an integer", () => {
        const board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "credits": 5 },
        ]);

        expect(() => {
            const newBoard = spendCredits(board, "p1", 5.6);
        }).toThrow("Credits must be an integer");
    });

    it("throws error when credits is not an integer", () => {
        const board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "credits": 1 },
        ]);

        expect(() => {
            const newBoard = spendCredits(board, "p1", 5);
        }).toThrow("Player does not have enough credits");
    });

    it("spend 0 credits", () => {
        let board = instantiateCustomBoardState([{ "villain-name": "Moff Gideon", "credits": 5 }]);

        board = spendCredits(board, "p1", 0);
        const player = getPlayerById(board, "p1");

        expect(player["credits"]).toEqual(5);
    });

    it("spend 3 credits", () => {
        let board = instantiateCustomBoardState([{ "villain-name": "Moff Gideon", "credits": 5 }]);

        board = spendCredits(board, "p1", 3);
        const player = getPlayerById(board, "p1");

        expect(player["credits"]).toEqual(2);
    });
});
