module.exports = {
    "B1 Battle Droids": {
        "name": "B1 Battle Droids",
        "card-type": "Ally",
        "credit-cost": 1,
        "strength": 0,
        "description": "B1 Battle Droids get +1 Strength for each other Ally at their location.",
    },

    "BX-Droid Commandos": {
        "name": "BX-Droid Commandos",
        "card-type": "Ally",
        "credit-cost": 2,
        "strength": 2,
        "description":
            "When BX-Droid Commandos would be discarded in a Vanquish action, you may put them into your hand instead.",
    },

    "Droidekas": {
        "name": "Droidekas",
        "card-type": "Ally",
        "credit-cost": 2,
        "description":
            "When performing a Vanquish action, you may 1 Ambition to move Droidekas to the location of that action. Droidekas must be used in that action.",
        "strength": 2,
    },

    "B2 Super Battle Droids": {
        "name": "B2 Super Battle Droids",
        "card-type": "Ally",
        "credit-cost": 1,
        "description":
            "When B2 Super Battle Droids would be discarded in a Vanquish action, you may pay 1 Ambition instead to keep them in play.",
        "strength": 1,
    },

    "Magna Guard": {
        "name": "Magna Guard",
        "card-type": "Ally",
        "credit-cost": 3,
        "description": "Heroes cannot be moved or Maneuvered from Magna Guard's location.",
        "strength": 4,
    },

    "Gor": {
        "name": "Gor",
        "card-type": "Ally",
        "credit-cost": 3,
        "description":
            "When Gor is played, gain 1 Ambition. When Gor is used in a Vanquish action, gain 1 Ambition.",
        "strength": 3,
        "on-play-card": (state) => {
            console.log("Gor on play card");
        },
    },

    "Escape Plan": {
        "name": "Escape Plan",
        "card-type": "Effect",
        "ambition-cost": 1,
        "description": "Either play an Ally or Vehicle for free, or remove a Hero Vehicle.",
        "on-play-card": (state) => {
            console.log("Escape plan on play card");
        },
    },

    "Count Dooku's Orders": {
        "name": "Count Dooku's Orders",
        "card-type": "Effect",
        "ambition-cost": 2,
        "description":
            "Reveal cards from your deck until you reveal an Ally. Play that Ally for free to any location in your Sector. Reveal cards from your Fate deck until you reveal a Hero. Play that Hero to any location in your Sector.",
        "on-play-card": (state) => {
            console.log("Count Dooku's Orders on play card");
        },
    },

    "Motivational Tactics": {
        "name": "Motivational Tactics",
        "card-type": "Effect",
        "ambition-cost": 0,
        "description": "Remove an Ally from your Sector. Gain either 2 Ambition or 2 Credits.",
        "on-play-card": (state) => {
            console.log("Escape plan on play card");
        },
    },

    "Add to My Collection": {
        "name": "Add to My Collection",
        "card-type": "Effect",
        "ambition-cost": 4,
        "description": "Collect one Lightsaber.",
        "on-play-card": (state) => {
            console.log("Escape plan on play card");
        },
    },

    "Hunting Jedi": {
        "name": "Hunting Jedi",
        "card-type": "Condition",
        "description":
            "During their turn, if another player takes a Play a Card action, you may play Hunting Jedi. Reveal cards from your Fate deck until you reveal a Hero. Play that Hero to any location in your Sector.",
        "on-play-card": (state) => {
            console.log("Escape plan on play card");
        },
    },

    "Trained in the Jedi Arts": {
        "name": "Trained in the Jedi Arts",
        "card-type": "Condition",
        "description":
            "During their turn, if another player targets you with a Fate action, you may play Trained in the Jedi Arts. They do not reveal cards from the Fate deck, but instead must play a Hero from your Fate discard pile.",
        "on-play-card": (state) => {
            console.log("Escape plan on play card");
        },
    },

    "Soulless One": {
        "name": "Soulless One",
        "card-type": "Vehicle",
        "credit-cost": 2,
        "description": "Draw two cards.",
        "actions": ["Vanquish", "Maneuver", "Collect 1 Credit"],
    },

    "Malevolence": {
        "name": "Malevolence",
        "card-type": "Vehicle",
        "credit-cost": 3,
        "description": "You may Remove two Allies, then defeat a Hero.",
        "actions": ["Discard Cards", "Ambition", "Vanquish"],
    },
};
