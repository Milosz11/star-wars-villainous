const { instantiateCustomBoardState, instantiateStartingBoardState } = require("../src/construct");
const { beginGame, shuffleDeck, addCredits, drawVillainCard } = require("../src/core");

describe("shuffleDeck", () => {
    const originalDeck = [
        {
            "name": "Dark Troopers",
            "card-type": "Ally",
        },
        {
            "name": "Death Troopers",
            "card-type": "Ally",
        },
        {
            "name": "Stormtroopers",
            "card-type": "Ally",
        },
        {
            "name": "Doctor Pershing",
            "card-type": "Ally",
        },
        {
            "name": "The Client",
            "card-type": "Ally",
        },
        {
            "name": "Beskar",
            "card-type": "Item",
        },
        {
            "name": "Darksaber",
            "card-type": "Item",
        },
    ];
    const compareFn = (a, b) => {
        return a["name"].length - b["name"].length;
    };

    it("throws exceptions on invalid input 1", () => {
        expect(() => {
            const { _shuffled, _seed } = shuffleDeck([], 2);
        }).toThrow("'seedStr' must be a string");
    });

    it("throws exceptions on invalid input 2", () => {
        expect(() => {
            const { _shuffled, _seed } = shuffleDeck(3, "saeotu23478qeu3r2dcgndt");
        }).toThrow("'list' must be an array");
    });

    it("results should be reproducible given same seed", () => {
        const seed = "01234567890123456789";

        const { shuffled1, seedStr1 } = shuffleDeck(originalDeck, seed);
        const { shuffled2, seedStr2 } = shuffleDeck(originalDeck, seed);

        expect(shuffled1).toEqual(shuffled2);
        expect(seedStr1).toEqual(seedStr2);
    });

    it("unshuffling should give back the same array", () => {
        const originalSorted = originalDeck.toSorted(compareFn);

        const { shuffled, _ } = shuffleDeck(originalDeck, "randomseed");
        const newlySorted = shuffled.toSorted(compareFn);

        expect(originalSorted).toEqual(newlySorted);
    });

    it("shuffled deck should have the same elements (none are missing or duplicated)", () => {
        const { shuffled, _ } = shuffleDeck(originalDeck, "randomseedrandomseed");

        const groupByCount = (array) => {
            return array.reduce((acc, item) => {
                acc[item] = (acc[item] || 0) + 1;
                return acc;
            }, {});
        };

        expect(groupByCount(originalDeck)).toEqual(groupByCount(shuffled));
    });
});

describe("addCredits", () => {
    it.todo("increments from zero");

    it.todo("increments from non-zero number");
});

describe("beginGame initializes the game board", () => {
    it.todo("shuffle all villain and fate decks");

    it.todo("add credits to non-first players per game rules");
});

describe("drawVillainCard", () => {
    it.todo("card gets removed from villain deck");

    it.todo("card gets added to hand");
});
