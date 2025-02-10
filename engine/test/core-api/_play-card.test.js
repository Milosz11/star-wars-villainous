const { instantiateCustomBoardState } = require("../../src/construct");
const { getPlayerById, getLocationByName } = require("../../src/core");
const { _playCard } = require("../../src/core-api");

describe("_playCard", () => {
    it("throws error on non-existent playerId", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-mover-location": "The Bridge",
                "credits": 4,
                "hand": ["Death Troopers"],
            },
        ]);

        expect(() => {
            _playCard(board, "a1", "p1c1", { "location": "Nevarro City" });
        }).toThrow("Non-existent player id");
    });

    it("throws error on non-existent card id", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-mover-location": "The Bridge",
                "credits": 4,
                "hand": ["Death Troopers"],
            },
        ]);

        expect(() => {
            _playCard(board, "p1", "p1c60", { "location": "Nevarro City" });
        }).toThrow("Non-existent card id");
    });

    it("throws error if the card does not belong to the player", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-mover-location": "The Bridge",
                "credits": 4,
                "hand": ["Death Troopers"],
            },
            {
                "villain-name": "General Grievous",
                "villain-mover-location": "Florrum",
                "credits": 4,
                "hand": ["Magna Guard"],
            },
        ]);

        expect(() => {
            _playCard(board, "p1", "p2c1", { "location": "Nevarro City" });
        }).toThrow("Card does not belong to player");
    });

    it("throws error if a card that doesn't cost credits is played", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-mover-location": "The Bridge",
                "credits": 4,
                "hand": ["The Kid's Just Fine"],
            },
        ]);

        expect(() => {
            _playCard(board, "p1", "p1c1", {});
        }).toThrow("Can only play cards that cost credits with a Play a Card action");
    });

    it("throws error if the player has not have enough credits to play the card", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-mover-location": "The Bridge",
                "credits": 0,
                "hand": ["Death Troopers"],
            },
        ]);

        expect(() => {
            _playCard(board, "p1", "p1c1", { "location": "Nevarro City" });
        }).toThrow("Player does not have enough credits");
    });

    it("throws error if an ally or vehicle card does not provide a location key", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-mover-location": "The Bridge",
                "credits": 4,
                "hand": ["Death Troopers"],
            },
        ]);

        expect(() => {
            _playCard(board, "p1", "p1c1", {});
        }).toThrow("Ally or Vehicle needs a location to play to");
    });

    it("throws error if an ally or vehicle card provides a bad location key", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-mover-location": "The Bridge",
                "credits": 4,
                "hand": ["Death Troopers"],
            },
        ]);

        expect(() => {
            _playCard(board, "p1", "p1c1", { "location": "Mustafar" });
        }).toThrow("Non-existent location");
    });

    // TODO determine item attach logic
    it.todo("throws error if an item card is missing its relevant information");

    it("decrements the card's credit cost from the player", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-mover-location": "The Bridge",
                "credits": 4,
                "hand": ["Death Troopers"],
            },
        ]);

        const newBoard = _playCard(board, "p1", "p1c1", { "location": "Nevarro City" });

        expect(getPlayerById(newBoard, "p1")["credits"]).toEqual(2);
    });

    it("if an ally, adds it to the right location and removes from hand", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "villain-mover-location": "The Bridge",
                "credits": 4,
                "hand": ["Death Troopers"],
            },
        ]);

        const newBoard = _playCard(board, "p1", "p1c1", { "location": "Nevarro City" });

        const player = getPlayerById(newBoard, "p1");
        expect(player["hand"]).toHaveLength(0);

        const nevarroCity = getLocationByName(newBoard, "p1", "Nevarro City");
        const villainSideIds = nevarroCity["villain-side-cards"].map((c) => c["card-id"]);
        expect(villainSideIds).toEqual(["p1c1"]);
    });

    // TODO determine vehicle logic
    it.todo("if a vehicle, adds it to the right location and removes from hand");

    // TODO determine item logic
    it.todo("if an item card, remove from hand, adds it to the right pile according to the item");

    // TODO test with non-ally non-vehicle card that costs credits
    it.todo("if other type of card, removes from hand, adds to discard pile");

    it.todo("activate's the card's on-play-card");

    it.todo("call every card's on-other-card-played");
});
