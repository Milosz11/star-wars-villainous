const { instantiateCustomBoardState } = require("../../src/construct");
const { addCredits } = require("../../src/core");

describe("addCredits", () => {
    it("throws error on non-existent player id", () => {
        const board = instantiateCustomBoardState("Moff Gideon");

        expect(() => {
            const newBoard = addCredits(board, "h3", 3);
        }).toThrow("Non-existent player id");
    });

    it("throws error when credits is negative", () => {
        const board = instantiateCustomBoardState("Moff Gideon");

        expect(() => {
            const newBoard = addCredits(board, "p1", -2);
        }).toThrow("Credit amount must be non-negative");
    });

    it("throws error when credits is not an integer", () => {
        const board = instantiateCustomBoardState("Moff Gideon");

        expect(() => {
            const newBoard = addCredits(board, "p1", 5.6);
        }).toThrow("Credit amount must be an integer");
    });

    it("increments from zero", () => {
        const board = instantiateCustomBoardState("Moff Gideon");

        const newBoard = addCredits(board, "p1", 3);

        expect(newBoard["sectors"]["p1"]["credits"]).toEqual(3);
    });

    it("increments from non-zero number", () => {
        const board = instantiateCustomBoardState({ "villain-name": "Moff Gideon", "credits": 3 });

        const newBoard = addCredits(board, "p1", 4);

        expect(newBoard["sectors"]["p1"]["credits"]).toEqual(7);
    });

    it("returns a new state", () => {
        const board = instantiateCustomBoardState({ "villain-name": "Moff Gideon", "credits": 3 });

        const newBoard = addCredits(board, "p1", 4);

        expect(newBoard).not.toBe(board);
    });
});
