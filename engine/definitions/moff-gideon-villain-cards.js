module.exports = {
    "Dark Troopers": {
        "name": "Dark Troopers",
        "card-type": "Ally",
        "credit-cost": 3,
        "strength": 5,
        "ambition-abilities": [
            {
                "description":
                    "If Grogu and no other Heroes are at this location, move Grogu to the Villain side of your Sector.",
                "ambition-cost": 0,
                "ability": (_state) => {
                    console.log("#FIXME Dark Troopers ambition ability.");
                },
            },
        ],
    },

    "Death Troopers": {
        "name": "Death Troopers",
        "card-type": "Ally",
        "credit-cost": 2,
        "strength": 2,
        "ambition-abilities": [
            {
                "description": "Maneuver Death Troopers to a new location.",
                "ambition-cost": 0,
                "ability": (_state) => {
                    console.log("#FIXME Death Troopers ambition ability");
                },
            },
        ],
    },

    "Stormtroopers": {
        "name": "Stormtroopers",
        "card-type": "Ally",
        "credit-cost": 1,
        "description": "No additional Ability.",
        "strength": 1,
    },

    "Doctor Pershing": {
        "name": "Doctor Pershing",
        "card-type": "Ally",
        "credit-cost": 1,
        "description":
            "If Moff Gideon is at Doctor Pershing's location, the Cost to play Dark Troopers is reduced by 1 Credit.",
        "strength": 0,
    },

    "The Client": {
        "name": "The Client",
        "card-type": "Ally",
        "credit-cost": 1,
        "strength": 0,
        "actions": ["Ambition"],
        "ambition-abilities": [
            {
                "description":
                    "Reveal cards from your deck until you reveal Beskar. Play it for free.",
                "ambition-cost": 2,
                "ability": (_state) => {
                    console.log("#FIXME The Client ambition ability.");
                },
            },
        ],
    },

    "Beskar": {
        "name": "Beskar",
        "card-type": "Item",
        "must-attach": true,
        "description": "Attach Beskar to an Ally.",
        "credit-cost": 2,
        "ambition-abilities": [
            {
                "description": "Remove Beskar to play any card from your hand for free.",
                "ambition-cost": 0,
                "ability": (_state) => {
                    console.log("#FIXME Beskar ambition ability 1.");
                },
            },
            {
                "description":
                    "Remove Beskar to find and play Grogu to the Hero side of your Sector.",
                "ambition-cost": 4,
                "ability": (_state) => {
                    console.log("#FIXME Beskar ambition ability 2.");
                },
            },
        ],
    },

    "Darksaber": {
        "name": "Darksaber",
        "card-type": "Item",
        "must-first-attach": true,
        "ambition-cost": 1,
        "description":
            "Attach Darksaber to an Ally. If that Ally is defeated, leave Darksaber at that location. The first Hero or Ally to that location attaches Darksaber and adds a +1 Strength token to it. Grogu cannot attach or use Darksaber.",
        "strength": 1,
    },

    "Laboratory Samples": {
        "name": "Laboratory Samples",
        "card-type": "Item",
        "ambition-cost": 2,
        "description": "No additional Ability.",
        "actions": ["Ambition"],
        "ambition-abilities": [
            {
                "description":
                    "If Moff Gideon, Grogu, and Dr. Pershing are in this location on the Villain side of your Sector, you win the game.",
                "ambition-cost": 5,
                "ability": (_state) => {
                    console.log("#FIXME Laboratory Samples ambition ability.");
                },
            },
        ],
    },

    "You Have Something I Want": {
        "name": "You Have Something I Want",
        "card-type": "Effect",
        "ambition-cost": 1,
        "description":
            "Reveal cards from your Fate deck until you reveal a Hero. Play that Hero to any location in your Sector.",
        "on-play-card": (_state) => {
            console.log("#FIXME You Have Something I Want card effect");
        },
    },

    "Me and the Kid Will Survive": {
        "name": "Me and the Kid Will Survive",
        "card-type": "Effect",
        "description": "All Heroes in your Sector get -1 Strength.",
        "ambition-cost": 2,
        "on-play-card": (_state) => {
            console.log("#FIXME Me and the Kid Will Survive card effect");
        },
    },

    "The Kid's Just Fine": {
        "name": "The Kid's Just Fine",
        "card-type": "Effect",
        "ambition-cost": 0,
        "description":
            "If Grogu is on the Villain side of the Sector, move him to a location with Dark Troopers.",
        "on-play-card": (_state) => {
            console.log("#FIXME The Kid's Just Fine card effect");
        },
    },

    "Captured": {
        "name": "Captured",
        "card-type": "Effect",
        "ambition-cost": 5,
        "description": "Find and play Grogu to any location on the Villain side of your Sector.",
        "on-play-card": (_state) => {
            console.log("#FIXME Captured card effect");
        },
    },

    "Experimentation": {
        "name": "Experimentation",
        "card-type": "Condition",
        "description":
            "During their turn, if another player spends Ambition, you may play Experimentation. Give each Dark Troopers in your Sector +1 Strength.",
        "on-play-card": (_state) => {
            console.log("#FIXME Experimentation card effect");
        },
    },

    "Long Live the Empire": {
        "name": "Long Live the Empire",
        "card-type": "Condition",
        "description":
            "During their turn, if another player takes a Discard action, you may play Long Live the Empire. Reshuffle your discard pile into your Villain deck. Gain 1 Ambition.",
        "on-play-card": (_state) => {
            console.log("#FIXME Long Live the Empire card effect");
        },
    },

    "Imperial Light Cruiser": {
        "name": "Imperial Light Cruiser",
        "card-type": "Vehicle",
        "credit-cost": 3,
        "description":
            "Either draw up to five cards at the end of your turn or gain 1 Ambition immediately.",
        "actions": ["Fate", "Play a Card", "Maneuver"],
    },

    "Outland TIE Fighter": {
        "name": "Outland TIE Fighter",
        "card-type": "Vehicle",
        "credit-cost": 3,
        "description":
            "Reveal cards from your Fate deck until you reveal a Hero. Play that Hero to any location and give them -1 Strength.",
        "actions": ["Ambition", "Maneuver", "Vanquish"],
    },
};
