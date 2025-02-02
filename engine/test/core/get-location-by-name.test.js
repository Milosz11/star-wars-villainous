const {
    instantiateCustomBoardState,
    instantiateStartingBoardState,
} = require("../../src/construct");
const { getLocationByName } = require("../../src/core");

describe("getLocationByName", () => {
    it("throws error on invalid player id", () => {
        const board = instantiateCustomBoardState(["Moff Gideon"]);

        expect(() => {
            const location = getLocationByName(board, "a1", "The Bridge");
        }).toThrow("Non-existent player id");
    });

    it("throws error on non-existent location name", () => {
        const board = instantiateStartingBoardState(["Moff Gideon", "General Grievous"]);

        expect(() => {
            const location = getLocationByName(board, "p1", "Mustafar");
        }).toThrow("Non-existent location provided");
    });

    it("gets the proper location", () => {
        const board = instantiateStartingBoardState(["Moff Gideon", "General Grievous"]);

        const location = getLocationByName(board, "p1", "The Bridge");

        expect(location).toHaveProperty("name", "The Bridge");
        expect(location).toHaveProperty("actions", [
            "Ambition",
            "Discard Cards",
            "Fate",
            "Play a Card",
        ]);
        expect(location).toHaveProperty("taken-actions", []);
        expect(location).toHaveProperty("hero-side-cards", []);
        expect(location).toHaveProperty("villain-side-cards", []);
    });
});
