const { instantiateCustomBoardState } = require("../../src/construct");
const { hasPlayerMoved } = require("../../src/core");
const { moveVillain, endTurn } = require("../../src/core-api");

describe("hasPlayerMoved", () => {
    it("returns false at the beginning of the game", () => {
        const board = instantiateCustomBoardState(["Moff Gideon", "General Grievous"]);

        expect(hasPlayerMoved(board, "p1")).toEqual(false);
    });

    it("returns false after circling around to the player again", () => {
        let board = instantiateCustomBoardState(["Moff Gideon", "General Grievous"]);

        board = moveVillain(board, "p1", "The Bridge");
        board = endTurn(board, "p1");
        board = moveVillain(board, "p2", "Utapau");
        board = endTurn(board, "p2");

        expect(hasPlayerMoved(board, "p1")).toEqual(false);
    });

    it("returns true when player at different location", () => { 
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "previous-villain-mover-location": "The Bridge",
                "villain-mover-location": "Tython",
            },
        ]);

        expect(hasPlayerMoved(board, "p1")).toEqual(true);
     });
});
