const { instantiateCustomBoardState } = require("../../src/construct");
const { getMaxHandSize } = require("../../src/core");

describe("getMaxHandSize", () => {
    it("gets the default", () => {
        const board = instantiateCustomBoardState(["Moff Gideon"]);

        const maxHandSize = getMaxHandSize(board, "p1");

        expect(maxHandSize).toEqual(4);
    });

    it.todo("is lower for every unengaged Hero Vehicle");
});
