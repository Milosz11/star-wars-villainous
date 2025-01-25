const { instantiateCustomBoardState } = require("../../src/construct");
const { getPlayerById } = require("../../src/core");

describe("getPlayerById", () => {
    it("throws error on non-existent player id", () => {
        const board = instantiateCustomBoardState(["Moff Gideon"]);

        expect(() => {
            const player = getPlayerById(board, "e1");
        }).toThrow("Non-existent player id");
    });

    it("gets the proper player 1", () => {
        const board = instantiateCustomBoardState(["Moff Gideon"]);

        const player = getPlayerById(board, "p1");

        expect(board["sectors"]["p1"]).toBe(player);
        expect(board["sectors"]["p1"]).toEqual(player);
    });

    it("gets the proper player 2", () => {
        const board = instantiateCustomBoardState(["Moff Gideon"]);

        const player = getPlayerById(board, "p2");

        expect(board["sectors"]["p2"]).toBe(player);
        expect(board["sectors"]["p2"]).toEqual(player);
    });
});
