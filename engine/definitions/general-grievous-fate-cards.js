module.exports = {
    "Anakin Skywalker": {
        "name": "Anakin Skywalker",
        "card-type": "Hero",
        "description": "When Anakin Skywalker is played, defeat all Allies at his location.",
        "strength": 4,
    },

    "Exposed": {
        "name": "Exposed",
        "card-type": "Effect",
        "description": "General Grievous loses up to 1 Ambition and up to 2 Credits.",
        "on-play-card": (_state) => {
            console.log("#FIXME Play Exposed");
        },
    },
};
