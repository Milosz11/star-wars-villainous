const { instantiateCustomBoardState } = require("../../src/construct");
const { onBeginTurn, getPlayerById } = require("../../src/core");

describe("onBeginTurn", () => {
    it("throws error on non-existent player id", () => {
        const board = instantiateCustomBoardState(["Moff Gideon"]);

        expect(() => {
            const newBoard = onBeginTurn(board, "o1");
        }).toThrow("Non-existent player id");
    });

    it("player gets 1 ambition", () => {
        const board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "ambition": 2 },
        ]);

        const newBoard = onBeginTurn(board, "p1");

        expect(getPlayerById(newBoard, "p1")["ambition"]).toEqual(3);
    });

    it("counter gets incremented", () => {
        const board = instantiateCustomBoardState(["Moff Gideon"]);

        const newBoard = onBeginTurn(board, "p1");

        expect(newBoard["counter"]).toEqual(1);
    });

    it.todo("previous mover location is set");

    it.todo("taken actions are cleared");
});
