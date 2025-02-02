const { instantiateCustomBoardState } = require("../../src/construct");
const { getPlayerById } = require("../../src/core");
const { moveVillain } = require("../../src/core-api");

describe("moveVillain", () => {
    it("throws exception on non-existent player id", () => {
        const board = instantiateCustomBoardState(["Moff Gideon"]);

        expect(() => {
            const newBoard = moveVillain(board, "h3", "Tython");
        }).toThrow("Non-existent player id");
    });

    it("throws exception when player is not in turn", () => {
        const board = instantiateCustomBoardState(["Moff Gideon", "General Grievous"]);

        expect(() => {
            const newBoard = moveVillain(board, "p2", "Florrum");
        }).toThrow("Player is not in turn");
    });

    it("throws exception on attempted second move", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "previous-villain-mover-location": "Nevarro City",
                "villain-mover-location": "Tython",
            },
        ]);

        expect(() => {
            const newBoard = moveVillain(board, "p1", "The Bridge");
        }).toThrow("Player has already moved this turn");
    });

    it("throws exception on non-existent location", () => {
        const board = instantiateCustomBoardState(["Moff Gideon"]);

        expect(() => {
            const newBoard = moveVillain(board, "p1", "Mustafar");
        }).toThrow("Non-existent location provided");
    });

    it("throws exception when moving to current location", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "previous-villain-mover-location": "The Bridge",
                "villain-mover-location": "The Bridge",
            },
        ]);

        expect(() => {
            const newBoard = moveVillain(board, "p1", "The Bridge");
        }).toThrow("Must move to a new location");
    });

    it("moves villain to proper location", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "previous-villain-mover-location": "The Bridge",
                "villain-mover-location": "The Bridge",
            },
        ]);

        const newBoard = moveVillain(board, "p1", "Nevarro City");
        const player = getPlayerById(newBoard, "p1");

        expect(player["villain-mover-location"]).toEqual("Nevarro City");
        expect(player["previous-villain-mover-location"]).toEqual("The Bridge");
    });
});
