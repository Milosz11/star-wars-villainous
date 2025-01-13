const fs = require("node:fs");
const { instantiateStartingBoardState } = require("../src/construct");

const data = fs.readFileSync("game-settings.json", "utf-8");
const settings = JSON.parse(data);
const availableVillains = settings["availableVillains"];

describe("instantiateStartingBoardState throws Error on bad input", () => {
    it("when invalid argument is passed", () => {
        expect(() => {
            instantiateStartingBoardState(availableVillains[0], "non-existent villain");
        }).toThrow("Bad villain name value");
    });

    it("with too little number of villains", () => {
        expect(() => {
            instantiateStartingBoardState(availableVillains[0]);
        }).toThrow("Improper length of villain names");
    });

    it("with too many number of villains", () => {
        expect(() => {
            instantiateStartingBoardState(
                availableVillains[0],
                availableVillains[1],
                availableVillains[2]
            );
        }).toThrow("Improper length of villain names");
    });

    it("when duplicate villain names are passed", () => {
        expect(() => {
            instantiateStartingBoardState(availableVillains[0], availableVillains[0]);
        }).toThrow("Duplicate villain names passed");
    });
});

describe("instantiateStartingBoardState properly constructs initial game board", () => {
    const board = instantiateStartingBoardState(availableVillains[0], availableVillains[1]);

    it("has proper first level keys", () => {
        expect(board).toHaveProperty("player-id-in-turn", "p1");
        expect(board).toHaveProperty("counter", 0);
        expect(board).toHaveProperty("sectors", expect.any(Object));
    });

    it("has proper keys in a sector", () => {
        const sector = board["sectors"]["p1"];
        expect(sector).toHaveProperty("villain-mover-position", 0);
        expect(sector).toHaveProperty("ambition", 0);
        expect(sector).toHaveProperty("credits", 0);
        expect(sector).toHaveProperty("locations");
        expect(sector).toHaveProperty("hand", []);
        expect(sector).toHaveProperty("villain-deck");
        expect(sector).toHaveProperty("villain-discard-pile", []);
        expect(sector).toHaveProperty("fate-deck");
        expect(sector).toHaveProperty("fate-discard-pile", []);
    });

    it("has proper keys in a location", () => {
        const location = board["sectors"]["p1"]["locations"][0];
        expect(location).toHaveProperty("name", expect.any(String));
        expect(location).toHaveProperty("actions", expect.any(Array));
        expect(location).toHaveProperty("taken-actions", expect.any(Array));
        expect(location).toHaveProperty("hero-side-cards", expect.any(Array));
        expect(location).toHaveProperty("villain-side-cards", expect.any(Array));
    });

    it("has proper keys in a villain card", () => {
        const villainCard = board["sectors"]["p1"]["villain-deck"][0];
        expect(villainCard).toHaveProperty("name", expect.any(String));
        expect(villainCard).toHaveProperty("card-type", expect.any(String));
    });

    it("has proper keys in a fate card", () => {
        const fateCard = board["sectors"]["p1"]["fate-deck"][0];
        expect(fateCard).toHaveProperty("name", expect.any(String));
        expect(fateCard).toHaveProperty("card-type", expect.any(String));
        expect(fateCard).toHaveProperty("description", expect.any(String));
        expect(fateCard).toHaveProperty("on-play-card", expect.any(Function));
    });

    it("ally card type gets specific keys", () => {
        const filteredAllyCard = board["sectors"]["p1"]["villain-deck"].filter((card) => {
            return card["card-type"] == "Ally";
        })[0];

        expect(filteredAllyCard).toHaveProperty("attached-cards", expect.any(Array));
        expect(filteredAllyCard).toHaveProperty("additional-strength", expect.any(Number));
    });

    it("hero card type gets specific keys", () => {
        const filteredHeroCard = board["sectors"]["p1"]["fate-deck"].filter((card) => {
            return card["card-type"] == "Hero";
        })[0];

        expect(filteredHeroCard).toHaveProperty("attached-cards", expect.any(Array));
        expect(filteredHeroCard).toHaveProperty("additional-strength", expect.any(Number));
    });

    it("non-ally, non-hero card type does not get ally/hero specific keys", () => {
        const filteredAllyCard = board["sectors"]["p1"]["villain-deck"].filter((card) => {
            return card["card-type"] == "Effect";
        })[0];
        const filteredHeroCard = board["sectors"]["p1"]["fate-deck"].filter((card) => {
            return card["card-type"] == "Effect";
        })[0];

        expect(filteredAllyCard).not.toHaveProperty("attached-cards", expect.any(Array));
        expect(filteredAllyCard).not.toHaveProperty("additional-strength", expect.any(Number));

        expect(filteredHeroCard).not.toHaveProperty("attached-cards", expect.any(Array));
        expect(filteredHeroCard).not.toHaveProperty("additional-strength", expect.any(Number));
    });
});
