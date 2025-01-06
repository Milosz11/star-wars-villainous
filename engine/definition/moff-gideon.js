export default {
    "villain-name": "Moff Gideon",
    "objective": "Capture and experiment on Grogu.",
    "locations": [
        {
            "name": "Nevarro City",
            "actions": ["Collect 2 Credits", "Ambition", "Play a Card", "Vanquish"],
        },
        {
            "name": "Old Imperial Base",
            "actions": ["Play a Card", "Maneuver", "Collect 2 Credits", "Ambition"],
        },
        {
            "name": "Tython",
            "actions": ["Play a Card", "Vanquish", "Discard Cards", "Collect 2 Credits"],
        },
        {
            "name": "The Bridge",
            "actions": ["Ambition", "Discard Cards", "Fate", "Play a Card"],
        },
    ],
    "villain-deck": [
        {
            "count": 4,
            "card": {
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
        },
        {
            "count": 2,
            "card": {
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
        },
        {
            "count": 2,
            "card": {
                "name": "Stormtroopers",
                "card-type": "Ally",
                "credit-cost": 1,
                "description": "No additional Ability.",
                "strength": 1,
            },
        },
        {
            "count": 1,
            "card": {
                "name": "Doctor Pershing",
                "card-type": "Ally",
                "credit-cost": 1,
                "description":
                    "If Moff Gideon is at Doctor Pershing's location, the Cost to play Dark Troopers is reduced by 1 Credit.",
                "strength": 0,
            },
        },
        {
            "count": 1,
            "card": {
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
        },
        {
            "count": 3,
            "card": {
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
        },
        {
            "count": 1,
            "card": {
                "name": "Darksaber",
                "card-type": "Item",
                "must-first-attach": true,
                "ambition-cost": 1,
                "description":
                    "Attach Darksaber to an Ally. If that Ally is defeated, leave Darksaber at that location. The first Hero or Ally to that location attaches Darksaber and adds a +1 Strength token to it. Grogu cannot attach or use Darksaber.",
                "strength": 1,
            },
        },
        {
            "count": 1,
            "card": {
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
        },
        {
            "count": 2,
            "card": {
                "name": "You Have Something I Want",
                "card-type": "Effect",
                "ambition-cost": 1,
                "description":
                    "Reveal cards from your Fate deck until you reveal a Hero. Play that Hero to any location in your Sector.",
                "on-play-card": (_state) => {
                    console.log("#FIXME You Have Something I Want card effect");
                },
            },
        },
        {
            "count": 2,
            "card": {
                "name": "Me and the Kid Will Survive",
                "card-type": "Effect",
                "description": "All Heroes in your Sector get -1 Strength.",
                "ambition-cost": 2,
                "on-play-card": (_state) => {
                    console.log("#FIXME Me and the Kid Will Survive card effect");
                },
            },
        },
        {
            "count": 2,
            "card": {
                "name": "The Kid's Just Fine",
                "card-type": "Effect",
                "ambition-cost": 0,
                "description":
                    "If Grogu is on the Villain side of the Sector, move him to a location with Dark Troopers.",
                "on-play-card": (_state) => {
                    console.log("#FIXME The Kid's Just Fine card effect");
                },
            },
        },
        {
            "count": 1,
            "card": {
                "name": "Captured",
                "card-type": "Effect",
                "ambition-cost": 5,
                "description":
                    "Find and play Grogu to any location on the Villain side of your Sector.",
                "on-play-card": (_state) => {
                    console.log("#FIXME Captured card effect");
                },
            },
        },
        {
            "count": 3,
            "card": {
                "name": "Experimentation",
                "card-type": "Condition",
                "description":
                    "During their turn, if another player spends Ambition, you may play Experimentation. Give each Dark Troopers in your Sector +1 Strength.",
                "on-play-card": (_state) => {
                    console.log("#FIXME Experimentation card effect");
                },
            },
        },
        {
            "count": 3,
            "card": {
                "name": "Long Live the Empire",
                "card-type": "Condition",
                "description":
                    "During their turn, if another player takes a Discard action, you may play Long Live the Empire. Reshuffle your discard pile into your Villain deck. Gain 1 Ambition.",
                "on-play-card": (_state) => {
                    console.log("#FIXME Long Live the Empire card effect");
                },
            },
        },
        {
            "count": 1,
            "card": {
                "name": "Imperial Light Cruiser",
                "card-type": "Vehicle",
                "credit-cost": 3,
                "description":
                    "Either draw up to five cards at the end of your turn or gain 1 Ambition immediately.",
                "actions": ["Fate", "Play a Card", "Maneuver"],
            },
        },
        {
            "count": 1,
            "card": {
                "name": "Outland TIE Fighter",
                "card-type": "Vehicle",
                "credit-cost": 3,
                "description":
                    "Reveal cards from your Fate deck until you reveal a Hero. Play that Hero to any location and give them -1 Strength.",
                "actions": ["Ambition", "Maneuver", "Vanquish"],
            },
        },
    ],
    "hero-deck": [
        {
            "count": 1,
            "card": {
                "name": "The Mandalorian",
                "card-type": "Hero",
                "description":
                    "The Mandalorian gets +2 Strength if Grogu is at his location. Grogu may be on either the Hero or Villain side of Moff Gideon's Sector",
                "strength": 4,
                "on-play-card": (_state) => {
                    console.log("#FIXME The Mandalorian on play");
                },
            },
        },
        {
            "count": 1,
            "card": {
                "name": "Grogu",
                "card-type": "Hero",
                "description":
                    "When Grogu is revealed in a Fate action, you must play him immediately to a location with another Hero. If no other Hero is in play, discard both Grogu and the other Fate card drawn. Grogu cannot be defeated, removed, or targeted with a Vanquish action.",
                "strength": 0,
            },
        },
        {
            "count": 1,
            "card": {
                "name": "Bo-Katan Kryze",
                "card-type": "Hero",
                "description":
                    "If the Darksaber is in play when Bo-Katan Kryze is played, Moff Gideon loses 2 Ambition.",
                "strength": 3,
                "on-play-card": (_state) => {
                    console.log("#FIXME Bo-Katan Kryze on play");
                },
            },
        },
        {
            "count": 1,
            "card": {
                "name": "Koska Reeves",
                "card-type": "Hero",
                "description":
                    "If the Darksaber is in play when Koska Reeves is played, Moff Gideon loses 1 Credit.",
                "strength": 2,
                "on-play-card": (_state) => {
                    console.log("#FIXME Koska Reeves on play card");
                },
            },
        },
        {
            "count": 1,
            "card": {
                "name": "Fennec Shand",
                "card-type": "Hero",
                "description":
                    "When performing a Vanquish action to defeat Fennec Shand, at least two Allies must be used.",
                "strength": 3,
            },
        },
        {
            "count": 2,
            "card": {
                "name": "I Am Programmed to Protect",
                "card-type": "Effect",
                "description": "All Heroes in Moff Gideon's Sector get +1 Strength.",
                "on-play-card": (_state) => {
                    console.log("#FIXME I Am Programmed to Protect on play card");
                },
            },
        },
        {
            "count": 1,
            "card": {
                "name": "May the Force Be With You",
                "card-type": "Effect",
                "description": "All Allies in Moff Gideon's Sector get -1 Strength.",
                "on-play-card": (_state) => {
                    console.log("#FIXME may the force be with you on play card");
                },
            },
        },
        {
            "count": 1,
            "card": {
                "name": "Self-Protection",
                "card-type": "Effect",
                "description":
                    "Move Grogu to any location with no Allies present. Grogu must remain on the same side of Moff Gideon's Sector.",
                "on-play-card": (_state) => {
                    console.log("#FIXME self-protection card");
                },
            },
        },
        {
            "count": 1,
            "card": {
                "name": "The Bounty",
                "card-type": "Effect",
                "description": "Remove one Beskar from Moff Gideon's Sector.",
                "on-play-card": (_state) => {
                    console.log("#FIXME The bounty on play card");
                },
            },
        },
        {
            "count": 1,
            "card": {
                "name": "The Jedi",
                "card-type": "Effect",
                "description":
                    "Remove any Dark Troopers at Grogu's location. Move Grogu to any location on the Hero side of Moff Gideon's Sector.",
                "on-play-card": (_state) => {
                    console.log("#FIXME The Jedi on play card");
                },
            },
        },
        {
            "count": 1,
            "card": {
                "name": "The Return of Fett",
                "card-type": "Effect",
                "description":
                    "Swap The Return of Fett for up to 2 Hero cards from the Fate discard pile. Play both of those Heroes to any location in Moff Gideon's Sector.",
                "on-play-card": (_state) => {
                    console.log("#FIXME the return of fett on play card");
                },
            },
        },
        {
            "count": 1,
            "card": {
                "name": "Unexpected Help",
                "card-type": "Restriction",
                "description":
                    "When Unexpected Help is played, defeat all Allies in Grogu's location. No Allies may be played or Maneuvered to Grogu's location. Grogu is moved to the Hero side of the Sector at that location. Remove this card when you take a Vanquish action.",
                "on-play-card": (_state) => {
                    console.log("#FIXME unexpected help on play card");
                },
            },
        },
        {
            "count": 1,
            "card": {
                "name": "Razor Crest",
                "card-type": "Vehicle",
                "description": "When Razor Crest is played, you may move a Hero to any location.",
                "on-play-card": (_state) => {
                    console.log("#FIXME razor crest card");
                },
            },
        },
        {
            "count": 1,
            "card": {
                "name": "Captured Imperial Shuttle",
                "card-type": "Vehicle",
                "description":
                    "When Captured Imperial Shuttle is played, discard the top four cards of Moff Gideon's deck.",
                "on-play-card": (_state) => {
                    console.log("#FIXME captured imperial shuttle on play card");
                },
            },
        },
    ],
};
