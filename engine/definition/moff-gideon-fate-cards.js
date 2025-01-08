module.exports = {
    "The Mandalorian": {
        "name": "The Mandalorian",
        "card-type": "Hero",
        "description":
            "The Mandalorian gets +2 Strength if Grogu is at his location. Grogu may be on either the Hero or Villain side of Moff Gideon's Sector",
        "strength": 4,
        "on-play-card": (_state) => {
            console.log("#FIXME The Mandalorian on play");
        },
    },

    "Grogu": {
        "name": "Grogu",
        "card-type": "Hero",
        "description":
            "When Grogu is revealed in a Fate action, you must play him immediately to a location with another Hero. If no other Hero is in play, discard both Grogu and the other Fate card drawn. Grogu cannot be defeated, removed, or targeted with a Vanquish action.",
        "strength": 0,
    },

    "Bo-Katan Kryze": {
        "name": "Bo-Katan Kryze",
        "card-type": "Hero",
        "description":
            "If the Darksaber is in play when Bo-Katan Kryze is played, Moff Gideon loses 2 Ambition.",
        "strength": 3,
        "on-play-card": (_state) => {
            console.log("#FIXME Bo-Katan Kryze on play");
        },
    },

    "Koska Reeves": {
        "name": "Koska Reeves",
        "card-type": "Hero",
        "description":
            "If the Darksaber is in play when Koska Reeves is played, Moff Gideon loses 1 Credit.",
        "strength": 2,
        "on-play-card": (_state) => {
            console.log("#FIXME Koska Reeves on play card");
        },
    },

    "Fennec Shand": {
        "name": "Fennec Shand",
        "card-type": "Hero",
        "description":
            "When performing a Vanquish action to defeat Fennec Shand, at least two Allies must be used.",
        "strength": 3,
    },

    "I Am Programmed to Protect": {
        "name": "I Am Programmed to Protect",
        "card-type": "Effect",
        "description": "All Heroes in Moff Gideon's Sector get +1 Strength.",
        "on-play-card": (_state) => {
            console.log("#FIXME I Am Programmed to Protect on play card");
        },
    },

    "May the Force Be With You": {
        "name": "May the Force Be With You",
        "card-type": "Effect",
        "description": "All Allies in Moff Gideon's Sector get -1 Strength.",
        "on-play-card": (_state) => {
            console.log("#FIXME may the force be with you on play card");
        },
    },

    "Self-Protection": {
        "name": "Self-Protection",
        "card-type": "Effect",
        "description":
            "Move Grogu to any location with no Allies present. Grogu must remain on the same side of Moff Gideon's Sector.",
        "on-play-card": (_state) => {
            console.log("#FIXME self-protection card");
        },
    },

    "The Bounty": {
        "name": "The Bounty",
        "card-type": "Effect",
        "description": "Remove one Beskar from Moff Gideon's Sector.",
        "on-play-card": (_state) => {
            console.log("#FIXME The bounty on play card");
        },
    },

    "The Jedi": {
        "name": "The Jedi",
        "card-type": "Effect",
        "description":
            "Remove any Dark Troopers at Grogu's location. Move Grogu to any location on the Hero side of Moff Gideon's Sector.",
        "on-play-card": (_state) => {
            console.log("#FIXME The Jedi on play card");
        },
    },

    "The Return of Fett": {
        "name": "The Return of Fett",
        "card-type": "Effect",
        "description":
            "Swap The Return of Fett for up to 2 Hero cards from the Fate discard pile. Play both of those Heroes to any location in Moff Gideon's Sector.",
        "on-play-card": (_state) => {
            console.log("#FIXME the return of fett on play card");
        },
    },

    "Unexpected Help": {
        "name": "Unexpected Help",
        "card-type": "Restriction",
        "description":
            "When Unexpected Help is played, defeat all Allies in Grogu's location. No Allies may be played or Maneuvered to Grogu's location. Grogu is moved to the Hero side of the Sector at that location. Remove this card when you take a Vanquish action.",
        "on-play-card": (_state) => {
            console.log("#FIXME unexpected help on play card");
        },
    },

    "Razor Crest": {
        "name": "Razor Crest",
        "card-type": "Vehicle",
        "description": "When Razor Crest is played, you may move a Hero to any location.",
        "on-play-card": (_state) => {
            console.log("#FIXME razor crest card");
        },
    },

    "Captured Imperial Shuttle": {
        "name": "Captured Imperial Shuttle",
        "card-type": "Vehicle",
        "description":
            "When Captured Imperial Shuttle is played, discard the top four cards of Moff Gideon's deck.",
        "on-play-card": (_state) => {
            console.log("#FIXME captured imperial shuttle on play card");
        },
    },
};
