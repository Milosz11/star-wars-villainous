const { instantiateCustomBoardState } = require("../../src/construct");
const { getPlayerIdInTurn } = require("../../src/core");

describe("getPlayerIdInTurn", () => {
    it("gets the proper player id at the start of the game", () => {
        const board = instantiateCustomBoardState(["Moff Gideon"]);

        const playerId = getPlayerIdInTurn(board);

        expect(playerId).toBe("p1");
    });

    it.todo("gets the proper player id after the end of a turn");
});
