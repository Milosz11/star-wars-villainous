const fs = require("node:fs");
const path = require("path");

const { instantiateStartingBoardState } = require("../../engine/src/construct");
const { beginGame } = require("../../engine/src/core");

module.exports = (req, res) => {
    try {
        const playerVillains = req.body.players;

        if (!playerVillains || !Array.isArray(playerVillains)) {
            res.status(400).json({ status: "error", errorMessage: "'players' must be a list" });
        }

        // TODO simplify
        const p = path.join(__dirname, "..", "..", "engine", "game-settings.json");
        const data = fs.readFileSync(p, "utf-8");
        const settings = JSON.parse(data);

        if (playerVillains.length < 2 || settings["maxNumPlayers"] < playerVillains.length) {
            res.status(400).json({
                status: "error",
                errorMessage: "'players' length must be on the range [2, <maxNumPlayers>].",
            });
        }

        if (
            playerVillains.some((villainName) => {
                return !settings["availableVillains"].includes(villainName);
            })
        ) {
            res.status(400).json({ status: "error", errorMessage: "Invalid Villain name" });
        }

        const gameBoard = beginGame(instantiateStartingBoardState(playerVillains, { seed: req.body.seed }));

        res.status(200).json({
            status: "success",
            gameId: "123",
            gameBoard,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "error", errorMessage: err.message });
    }
};
