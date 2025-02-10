const { instantiateCustomBoardState } = require("../../src/construct");
const { _canTakeAction, takeAction } = require("../../src/core-api");

describe("canTakeAction", () => {
    it("throws exception on non-existent player id", () => {
        const board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "villain-mover-location": "The Bridge" },
        ]);

        expect(() => {
            _canTakeAction(board, "a1", "Play a Card");
        }).toThrow("Non-existent player id");
    });

    it("throws exception when player is not in turn", () => {
        const board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "villain-mover-location": "The Bridge" },
            { "villain-name": "General Grievous", "villain-mover-location": "Florrum" },
        ]);

        expect(() => {
            _canTakeAction(board, "p2", "Ambition");
        }).toThrow("Player is not in turn");
    });

    it("throws exception when player has not yet moved this turn", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-mover-location": "The Bridge",
                "previous-villain-mover-location": "The Bridge",
            },
        ]);

        expect(() => {
            _canTakeAction(board, "p1", "Play a Card");
        }).toThrow("Player must move before taking actions");
    });

    it("throws exception if the current location doesn't have the specified action", () => {
        const board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "villain-mover-location": "The Bridge" },
        ]);

        expect(() => {
            _canTakeAction(board, "p1", "Collect 2 Credits");
        }).toThrow("Location does not have specified action");
    });

    it("throws exception if the current action is blocked", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-mover-location": "The Bridge",
                "locations": { "The Bridge": { "hero-side-cards": ["The Mandalorian"] } },
            },
        ]);

        expect(() => {
            _canTakeAction(board, "p1", "Ambition");
        }).toThrow("The action is blocked by a Hero card");
    });

    it("throws exception if the action was already taken", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-mover-location": "Tython",
            },
        ]);

        const newBoard = takeAction(board, "p1", "Collect 2 Credits", {});

        expect(() => {
            _canTakeAction(newBoard, "p1", "Collect 2 Credits");
        }).toThrow("This action was already taken");
    });

    it("successfully returns true when no rule is violated", () => {
        const board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "villain-mover-location": "The Bridge" },
        ]);

        expect(_canTakeAction(board, "p1", "Play a Card")).toBeTruthy();
    });
});
