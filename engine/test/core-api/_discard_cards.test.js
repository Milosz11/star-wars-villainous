const { instantiateCustomBoardState } = require("../../src/construct");
const { getPlayerById, getLocationByName } = require("../../src/core");
const { _discardCards } = require("../../src/core-api");

describe("_discardCards", () => {
    it("throws error when card not belonging to player is specified", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-mover-location": "The Bridge",
                "hand": ["Death Troopers"],
            },
            {
                "villain-name": "General Grievous",
                "hand": ["Droidekas"],
            }
        ]);

        expect(() => {
            _discardCards(board, "p1", ["p2c1"]);
        }).toThrow("Cards to discard must belong to the player");
    });

    it("throws error when the card to discard is not in the hand", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-mover-location": "The Bridge",
                "hand": ["Death Troopers"],
                "villain-deck": ["Stormtroopers"],
            }
        ]);

        expect(() => {
            _discardCards(board, "p1", ["p1c2"]);
        }).toThrow("Card to discard is not in the player's hand");
    });

    it("removes from hand and adds to villain discard pile", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-mover-location": "The Bridge",
                "hand": ["Death Troopers"],
            }
        ]);

        const newBoard = _discardCards(board, "p1", ["p1c1"]);
        const newPlayer = getPlayerById(newBoard, "p1");

        expect(newPlayer["hand"]).toEqual([]);
        expect(newPlayer["villain-discard-pile"].map((card) => card["card-id"])).toEqual(["p1c1"]);
    });

    it("leaves other cards untouched", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-mover-location": "The Bridge",
                "hand": ["Death Troopers", "Doctor Pershing", "The Client"],
                "villain-discard-pile": ["Dark Troopers"],
            }
        ]);

        const newBoard = _discardCards(board, "p1", ["p1c2"]);
        const newPlayer = getPlayerById(newBoard, "p1");

        expect(newPlayer["hand"].map((card) => card["card-id"])).toEqual(["p1c1", "p1c3"]);
        expect(newPlayer["villain-discard-pile"].map((card) => card["card-id"])).toEqual(["p1c2", "p1c4"]);
    });

    it("discards multiple cards", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-mover-location": "The Bridge",
                "hand": ["Death Troopers", "Doctor Pershing", "The Client"],
                "villain-discard-pile": ["Dark Troopers"],
            },
            {
                "villain-name": "General Grievous",
                "hand": ["Droidekas"],
                "villain-discard-pile": ["Gor"],
            }
        ]);

        const newBoard = _discardCards(board, "p1", ["p1c2", "p1c3"]);
        
        const newPlayerOne = getPlayerById(newBoard, "p1");

        expect(newPlayerOne["hand"].map((card) => card["card-id"])).toEqual(["p1c1"]);
        expect(newPlayerOne["villain-discard-pile"].map((card) => card["card-id"])).toEqual(["p1c2", "p1c3", "p1c4"]);

        const newPlayerTwo = getPlayerById(newBoard, "p2");

        expect(newPlayerTwo["hand"].map((card) => card["card-id"])).toEqual(["p2c1"]);
        expect(newPlayerTwo["villain-discard-pile"].map((card) => card["card-id"])).toEqual(["p2c2"]);
    });
});
