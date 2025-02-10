const { instantiateCustomBoardState } = require("../../src/construct");
const { getPlayerById } = require("../../src/core");
const { _collectCredits } = require("../../src/core-api");

describe("_collectCredits", () => {
    it("collect credits 1", () => {
        let board = instantiateCustomBoardState([{ "villain-name": "General Grievous" }]);

        board = _collectCredits(board, "p1", 3);

        const player = getPlayerById(board, "p1");
        expect(player["credits"]).toEqual(3);
    });

    it("collect credits 2", () => {
        let board = instantiateCustomBoardState([{ "villain-name": "Moff Gideon", "credits": 5 }]);

        board = _collectCredits(board, "p1", 3);

        const player = getPlayerById(board, "p1");
        expect(player["credits"]).toEqual(8);
    });

    it.todo("test on-collect-credits gets called properly");
});
