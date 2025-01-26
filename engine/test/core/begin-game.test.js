const { instantiateStartingBoardState } = require("../../src/construct");
const { beginGame, getPlayerById } = require("../../src/core");

describe("beginGame starts the game properly", () => {
    it("add credits to non-first players per game rules", () => {
        const startBoard = instantiateStartingBoardState(["Moff Gideon", "General Grievous"]);

        const board = beginGame(startBoard);

        expect(getPlayerById(board, "p1")["credits"]).toEqual(0);
        expect(getPlayerById(board, "p2")["credits"]).toEqual(1);
    });

    it("draws the initial hand for each player", () => {
        const startBoard = instantiateStartingBoardState(["Moff Gideon", "General Grievous"]);

        const board = beginGame(startBoard);

        expect(getPlayerById(board, "p1")["hand"]).toHaveLength(4);
        expect(getPlayerById(board, "p2")["hand"]).toHaveLength(4);
    });

    it.todo("shuffle all villain and fate decks - not sure how to test for this");
});
