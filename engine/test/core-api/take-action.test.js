const { instantiateCustomBoardState } = require("../../src/construct");
const { getLocationByName } = require("../../src/core");
const { takeAction } = require("../../src/core-api");

describe("takeAction", () => {
    it("appends taken action to location 1", () => {
        let board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "villain-mover-location": "Nevarro City" },
        ]);

        board = takeAction(board, "p1", "Collect 2 Credits", {});

        const location = getLocationByName(board, "p1", "Nevarro City");
        expect(location["taken-actions"]).toEqual(["Collect 2 Credits"]);
    });

    it("appends taken action to location 2", () => {
        let board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-mover-location": "Nevarro City",
                "credits": 2,
                "hand": ["Death Troopers"],
            },
        ]);

        board = takeAction(board, "p1", "Collect 2 Credits", {});
        board = takeAction(board, "p1", "Play a Card", {
            "card-id": "p1c1",
            "location": "Nevarro City",
        });

        const location = getLocationByName(board, "p1", "Nevarro City");
        expect(location["taken-actions"]).toEqual(["Collect 2 Credits", "Play a Card"]);
    });
});
