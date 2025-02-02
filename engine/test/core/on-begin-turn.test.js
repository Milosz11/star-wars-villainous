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

    it("previous mover location is set", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "previous-villain-mover-location": "The Bridge",
                "villain-mover-location": "Tython",
            },
        ]);

        const newBoard = onBeginTurn(board, "p1");
        const player = getPlayerById(newBoard, "p1");

        expect(player["previous-villain-mover-location"]).toEqual("Tython");
    });

    it.todo("taken actions are cleared");
});
