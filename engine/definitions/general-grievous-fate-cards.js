module.exports = {
    "Anakin Skywalker": {
        "name": "Anakin Skywalker",
        "card-type": "Hero",
        "description": "When Anakin Skywalker is played, defeat all Allies at his location.",
        "strength": 4,
    },

    "Kit Fisto": {
        "name": "Kit Fisto",
        "card-type": "Hero",
        "description":
            "When Kit Fisto is played, you may move all Heroes to any locations. When Kit Fisto is defeated, General Grievous collects one additional Lightsaber token.",
        "strength": 3,
    },

    "Plo Koon": {
        "name": "Plo Koon",
        "card-type": "Hero",
        "description":
            "When Plo Koon is played, you may move all Allies at his location to any other locations in General Grievous' Sector.",
        "strength": 3,
    },

    "Obi-Wan Kenobi": {
        "name": "Obi-Wan Kenobi",
        "card-type": "Hero",
        "description":
            "When Obi-Wan Kenobi is played, remove an Ally Vehicle from General Grievous' Sector.",
        "strength": 4,
    },

    "Ahsoka Tano": {
        "name": "Ahsoka Tano",
        "card-type": "Hero",
        "description":
            "Each time another Hero is played to General Grievous' Sector, Ahsoka Tano gets +1 Strength. When Ahsoka Tano is defeated General Grievous collects one additional Lightsaber.",
        "strength": 2,
        "on-play-card": (state, thisId, kvs) => {
            console.log("ahsoka tano on play card");
            return state;
        },
        "on-other-card-played": (state, stateId, kvs) => {
            console.log("ahsoka tano on other card played");
            return state;
        },
    },

    "Mace Windu": {
        "name": "Mace Windu",
        "card-type": "Hero",
        "description":
            "When Mace Windu is played, all Allies in General Grievous' Sector get -1 Strength.",
        "strength": 4,
    },

    "May the Force Be With You": {
        "name": "May the Force Be With You",
        "card-type": "Effect",
        "description": "All Heroes in General Grievous' Sector get +1 Strength.",
        "on-play-card": (_state) => {
            console.log("#FIXME Play May the Force Be With You");
        },
    },

    "Retreat": {
        "name": "Retreat",
        "card-type": "Effect",
        "description":
            "Choose up to 4 Strength of Allies in General Grievous' Sector. Remove those Allies. Retreat cannot affect Gor.",
        "on-play-card": (_state) => {
            console.log("#FIXME Play Retreat");
        },
    },

    "Exposed": {
        "name": "Exposed",
        "card-type": "Effect",
        "description": "General Grievous loses up to 1 Ambition and up to 2 Credits.",
        "on-play-card": (_state) => {
            console.log("#FIXME Play Exposed");
        },
    },

    "Captured": {
        "name": "Captured",
        "card-type": "Effect",
        "description":
            "Remove one Lightsaber from General Grievous and put it back in the uncollected pile.",
        "on-play-card": (_state) => {
            console.log("#FIXME Play Captured");
        },
    },

    "Under Repair": {
        "name": "Under Repair",
        "card-type": "Restriction",
        "description":
            "When Under Repair is played, General Grievous must immediately discard down to two cards. General Grievous may only draw up to two cards at the end of his turn. Pay 6 Credits to remove Under Repair.",
        "on-play-card": (_state) => {
            console.log("#FIXME Play Under Repair");
        },
    },

    "Delta-7 Jedi Starfighter": {
        "name": "Delta-7 Jedi Starfighter",
        "card-type": "Vehicle",
        "description":
            "While in play, General Grievous must play with his hand revealed to all players.",
        "on-play-card": (_state) => {
            console.log("#FIXME Play Delta-7 Jedi Starfighter");
        },
    },

    "The Negotiator": {
        "name": "The Negotiator",
        "card-type": "Vehicle",
        "description":
            "When engaged with another Vehicle, The Negotiator blocks that Vehicle's Ability as well as its actions.",
        "on-play-card": (_state) => {
            console.log("#FIXME Play The Negotiator");
        },
    },
};
