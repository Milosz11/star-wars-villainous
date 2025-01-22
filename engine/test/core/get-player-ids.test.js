const { instantiateCustomBoardState } = require("../../src/construct");
const { getPlayerIds } = require("../../src/core");

describe("getPlayerIds", () => {
    it("gets the expected player ids", () => {
        const board = instantiateCustomBoardState("Moff Gideon");

        const playerIds = getPlayerIds(board);

        expect(playerIds).toEqual(["p1", "p2"]);
    });
});
