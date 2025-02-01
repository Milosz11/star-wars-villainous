const { instantiateCustomBoardState } = require("../../src/construct");
const { getVillainLocationNames } = require("../../src/core");

describe("getVillainLocationNames", () => {
    it("gets the expected names", () => {
        const board = instantiateCustomBoardState(["Moff Gideon"]);

        const locationNames = getVillainLocationNames(board, "p1");

        expect(locationNames).toEqual([
            "Nevarro City",
            "Old Imperial Base",
            "Tython",
            "The Bridge",
        ]);
    });
});
