const { instantiateCustomBoardState } = require("../../src/construct");
const { addAmbition, getPlayerById } = require("../../src/core");

describe("addAmbition", () => {
    it("throws error on non-existent player id", () => {
        const board = instantiateCustomBoardState(["Moff Gideon"]);

        expect(() => {
            const newBoard = addAmbition(board, "h3", 3);
        }).toThrow("Non-existent player id");
    });

    it("throws error when ambition is negative", () => {
        const board = instantiateCustomBoardState(["Moff Gideon"]);

        expect(() => {
            const newBoard = addAmbition(board, "p1", -2);
        }).toThrow("Ambition amount must be non-negative");
    });

    it("throws error when ambition is not an integer", () => {
        const board = instantiateCustomBoardState(["Moff Gideon"]);

        expect(() => {
            const newBoard = addAmbition(board, "p1", 5.6);
        }).toThrow("Ambition amount must be an integer");
    });

    it("increments from zero", () => {
        const board = instantiateCustomBoardState(["Moff Gideon"]);

        const newBoard = addAmbition(board, "p1", 3);

        expect(newBoard["sectors"]["p1"]["ambition"]).toEqual(3);
    });

    it("increments from non-zero number", () => {
        const board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "ambition": 3 },
        ]);

        const newBoard = addAmbition(board, "p1", 4);

        expect(newBoard["sectors"]["p1"]["ambition"]).toEqual(7);
    });

    it("previous board state is not altered", () => {
        const board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "ambition": 3 },
        ]);

        const _ = addAmbition(board, "p1", 4);

        expect(getPlayerById(board, "p1")["ambition"]).toEqual(3);
    });
});
