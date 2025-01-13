const fs = require("node:fs");
const { instantiateStartingBoardState } = require("../src/construct");

module.exports = (req, res) => {
    try {
        // Key not in object
        if (!("availableVillains" in req.body)) {
            res.status(400).json({ error: "Key 'availableVillains' not provided" });
            return;
        }

        // Key's value is not array
        if (!Array.isArray(req.body["availableVillains"])) {
            res.status(400).json({ error: "Key 'availableVillains' is not an array" });
            return;
        }

        const data = fs.readFileSync("game-settings.json", "utf-8");
        const settings = JSON.parse(data);
        const availableVillains = settings["availableVillains"];
        const reqVillains = req.body["availableVillains"];

        // Array has a bad value (a string not matching any Villain one can play)
        for (const v of reqVillains) {
            if (!availableVillains.includes(v)) {
                res.status(400).json({ error: "Bad values in array 'availableVillains'" });
                return;
            }
        }

        // Array has duplicate Villain names
        const duplicates = reqVillains.filter((v, index) => reqVillains.indexOf(v) !== index);
        if (duplicates.length > 0) {
            res.status(400).json({ error: "'availableVillains' cannot contain duplicate values" });
            return;
        }

        // Less than 2 Villains were provided
        if (reqVillains.length < 2) {
            res.status(400).json({ error: "The game requires a minimum of 2 players." });
            return;
        }

        // This will eventually be 4, but baby steps.
        if (reqVillains.length > 2) {
            res.status(400).json({ error: "The game currently supports a maximum of 2 players." });
            return;
        }

        res.status(200).json({ success: instantiateStartingBoardState(...reqVillains) });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};
