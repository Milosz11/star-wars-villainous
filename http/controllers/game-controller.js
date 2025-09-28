const express = require("express");
const gameSettings = require("../routes/game-settings");
// const loadGame = require("../routes/load-game");
const newGame = require("../routes/new-game");

const router = express.Router();
router.use(express.json());

router.get("/game-settings", gameSettings);

router.post("/new-game", newGame);

// router.get("/load-game", loadGame);

module.exports = router;
