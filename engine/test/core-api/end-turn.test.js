const { instantiateCustomBoardState } = require("../../src/construct");
const { getPlayerById } = require("../../src/core");
const { endTurn, moveVillain } = require("../../src/core-api");

describe("endTurn", () => {
    it("throws exception on non-existent player id", () => {
        const board = instantiateCustomBoardState(["Moff Gideon"]);

        expect(() => {
            const newBoard = endTurn(board, "a1");
        }).toThrow("Non-existent player id");
    });

    it("throws exception when player is not in turn", () => {
        const board = instantiateCustomBoardState(["Moff Gideon"]);

        expect(() => {
            const newBoard = endTurn(board, "p2");
        }).toThrow("Player is not in turn");
    });

    it("throws exception if player hasn't moved", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "previous-villain-mover-location": "Nevarro City",
                "villain-mover-location": "Nevarro City",
            },
        ]);

        expect(() => {
            const newBoard = endTurn(board, "p1");
        }).toThrow("Player must move to a new location every turn");
    });

    it("player id in turn is changed", () => {
        const board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "villain-mover-location": "Nevarro City" },
        ]);

        const newBoard = endTurn(board, "p1");

        expect(newBoard["player-id-in-turn"]).toEqual("p2");
    });

    it("counter gets incremented", () => {
        const board = instantiateCustomBoardState([
            { "villain-name": "Moff Gideon", "villain-mover-location": "Nevarro City" },
        ]);

        const newBoard = endTurn(board, "p1");

        expect(newBoard["counter"]).toEqual(2);
    });

    it("player id in turn returns to p1 after last unique player", () => {
        let board = instantiateCustomBoardState(["Moff Gideon", "General Grievous"]);

        board = moveVillain(board, "p1", "The Bridge");
        board = endTurn(board, "p1");

        board = moveVillain(board, "p2", "Florrum");
        board = endTurn(board, "p2");

        expect(board["player-id-in-turn"]).toEqual("p1");
    });

    it("onEndTurn and onBeginTurn get invoked correctly", () => {
        const board = instantiateCustomBoardState([
            {
                "villain-name": "Moff Gideon",
                "hand": ["Dark Troopers", "Doctor Pershing"],
                "villain-deck": ["Imperial Light Cruiser", "Death Troopers", "Beskar"],
                "villain-mover-location": "Nevarro City",
            },
            {
                "villain-name": "General Grievous",
                "ambition": 3,
                "previous-villain-mover-location": "Lair of Grievous",
                "villain-mover-location": "Utapau",
            },
        ]);

        const newBoard = endTurn(board, "p1");

        // On end turn p1
        const player1 = getPlayerById(newBoard, "p1");
        expect(player1["hand"]).toHaveLength(4);
        expect(player1["villain-deck"]).toHaveLength(1);

        // On begin turn p2
        const player2 = getPlayerById(newBoard, "p2");
        expect(player2["ambition"]).toEqual(4);
        expect(player2["previous-villain-mover-location"]).toEqual("Utapau");
        // TODO Create General Grievous with taken actions in Utapau and test the list gets emptied
    });
});
