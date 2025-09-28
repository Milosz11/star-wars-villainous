const { instantiateCustomBoardState } = require("../../src/construct");
const { getCurrentLocation } = require("../../src/core");
const { moveVillain } = require("../../src/core-api");

describe("getCurrentLocation", () => {
    it("throws exception when invalid player", () => {
        const board = instantiateCustomBoardState(["Moff Gideon"]);

        expect(() => { 
            getCurrentLocation(board, "p4334");
         }).toThrow("Non-existent player id");
    });

    it("returns empty string at the start of the game", () => {
        const board = instantiateCustomBoardState(["Moff Gideon"]);

        expect(getCurrentLocation(board, "p1")).toEqual("");
    });

    it("returns proper location after moving", () => {
        let board = instantiateCustomBoardState(["Moff Gideon"]);

        board = moveVillain(board, "p1", "Nevarro City");

        const location = getCurrentLocation(board, "p1");

        expect(location).toHaveProperty("name", "Nevarro City");
        expect(location).toHaveProperty("actions", ["Collect 2 Credits", "Ambition", "Play a Card", "Vanquish"]);
        expect(location).toHaveProperty("villain-side-cards", []);
        expect(location).toHaveProperty("hero-side-cards", []);
        expect(location).toHaveProperty("taken-actions", []);
    });
});
