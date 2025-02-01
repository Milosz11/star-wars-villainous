const { instantiateCustomBoardState } = require("../../src/construct");
const { onEndTurn, getPlayerById } = require("../../src/core");

describe("onEndTurn", () => {
    it("throws error on non-existent player id", () => {
        const board = instantiateCustomBoardState(["Moff Gideon"]);

        expect(() => {
            const newBoard = onEndTurn(board, "o1");
        }).toThrow("Non-existent player id");
    });

    it("cards not drawn when hand size is max hand size", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "hand": ["Death Troopers", "Captured", "Doctor Pershing", "Outland TIE Fighter"],
                "villain-deck": ["Darksaber", "Imperial Light Cruiser"],
            },
        ]);

        const newBoard = onEndTurn(board, "p1");
        const player = getPlayerById(newBoard, "p1");

        expect(player["hand"]).toHaveLength(4);
        expect(player["villain-deck"]).toHaveLength(2);
    });

    it("cards get drawn to maximum hand size", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "hand": ["Darksaber", "Imperial Light Cruiser"],
                "villain-deck": [
                    "Death Troopers",
                    "Captured",
                    "Doctor Pershing",
                    "Outland TIE Fighter",
                ],
            },
        ]);

        const newBoard = onEndTurn(board, "p1");
        const player = getPlayerById(newBoard, "p1");

        expect(player["hand"]).toHaveLength(4);
        expect(player["villain-deck"]).toHaveLength(2);
    });
});
