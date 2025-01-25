const { instantiateCustomBoardState } = require("../../src/construct");
const { drawVillainCard, getPlayerById } = require("../../src/core");

describe("drawVillainCard", () => {
    it("throws error on non-existent player id", () => {
        const board = instantiateCustomBoardState(["Moff Gideon"]);

        expect(() => {
            const newBoard = drawVillainCard(board, "o1");
        }).toThrow("Non-existent player id");
    });

    it("card gets removed from villain deck", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-deck": ["The Client", "Dark Troopers"],
            },
        ]);

        const newBoard = drawVillainCard(board, "p1");
        const villainDeck = getPlayerById(newBoard, "p1")["villain-deck"];

        expect(villainDeck).toHaveLength(1);
        expect(villainDeck.map((card) => card["name"])).toEqual(["Dark Troopers"]);
    });

    it("card gets added to hand", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-deck": ["The Client", "Dark Troopers"],
            },
        ]);

        const newBoard = drawVillainCard(board, "p1");
        const hand = getPlayerById(newBoard, "p1")["hand"];

        expect(hand).toHaveLength(1);
        expect(hand.map((card) => card["name"])).toEqual(["The Client"]);
    });

    it("previous board is not altered", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-deck": ["The Client", "Dark Troopers"],
            },
        ]);

        const _ = drawVillainCard(board, "p1");
        const originalVillainDeck = getPlayerById(board, "p1")["villain-deck"];

        expect(originalVillainDeck).toHaveLength(2);
        expect(originalVillainDeck.map((card) => card["name"])).toEqual([
            "The Client",
            "Dark Troopers",
        ]);
    });

    it("card is the same card", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-deck": ["The Client", "Dark Troopers"],
            },
        ]);

        const newBoard = drawVillainCard(board, "p1");

        const cardInDeck = getPlayerById(board, "p1")["villain-deck"][0];
        const cardInHand = getPlayerById(newBoard, "p1")["hand"][0];

        expect(cardInHand["card-id"]).toEqual(cardInDeck["card-id"]);
    });

    it("on empty deck, reshuffles villain discard pile into villain deck, then draws card as normal", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "hand": [],
                "villain-deck": [],
                "villain-discard-pile": ["Captured"],
            },
        ]);

        const newBoard = drawVillainCard(board, "p1");

        const newHand = getPlayerById(newBoard, "p1")["hand"];
        const newVillainDiscardPile = getPlayerById(newBoard, "p1")["villain-discard-pile"];

        expect(newHand.map((card) => card["name"])).toEqual(["Captured"]);
        expect(newVillainDiscardPile).toHaveLength(0);
    });

    it("on empty deck, reshuffles villain discard pile into villain deck, then draws card as normal, all cards remain on the board", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "hand": ["Dark Troopers", "Doctor Pershing", "Beskar"],
                "villain-deck": [],
                "villain-discard-pile": [
                    "Captured",
                    "The Kid's Just Fine",
                    "Imperial Light Cruiser",
                ],
            },
        ]);

        const newBoard = drawVillainCard(board, "p1");
        const player = getPlayerById(newBoard, "p1");
        const newHand = player["hand"];
        const newVillainDeck = player["villain-deck"];
        const newVillainDiscardPile = player["villain-discard-pile"];

        expect(newHand).toHaveLength(4);
        expect(newVillainDeck).toHaveLength(2);
        expect(newVillainDiscardPile).toHaveLength(0);
    });
});
