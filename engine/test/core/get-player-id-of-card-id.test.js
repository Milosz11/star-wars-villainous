const { getPlayerIdOfCardId } = require("../../src/core");

describe("getPlayerIdOfCardId", () => {
    it("throws error when the cardId is not a string", () => { 
        expect(() => { 
            getPlayerIdOfCardId({ "card-id": "p2c3", "card-type": "Ally" });
        }).toThrow("cardId must be a string");
    });

    it("case 1", () => {
        expect(getPlayerIdOfCardId("p1c3")).toEqual("p1");
    });

    it("case 2", () => {
        expect(getPlayerIdOfCardId("p22c11")).toEqual("p22");
    });
});
