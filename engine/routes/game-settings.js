const fs = require("node:fs");

module.exports = (_req, res) => {
    try {
        const data = fs.readFileSync("game-settings.json", "utf-8");
        const jsonData = JSON.parse(data);
        res.status(200).json(jsonData);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
};
