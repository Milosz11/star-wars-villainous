const { instantiateCustomBoardState } = require("../../src/construct");
const { isPlayerIdInTurn } = require("../../src/core");
const { endTurn, moveVillain } = require("../../src/core-api");

describe("isPlayerIdInTurn", () => {
    it("returns false when player not in turn", () => {
        const board = instantiateCustomBoardState(["Moff Gideon"]);

        expect(isPlayerIdInTurn(board, "p2")).toEqual(false);
    });

    it("returns true when player in turn", () => { 
        let board = instantiateCustomBoardState(["Moff Gideon"]);

        board = moveVillain(board, "p1", "The Bridge");
        board = endTurn(board, "p1");

        expect(isPlayerIdInTurn(board, "p2")).toEqual(true);
    });
});
