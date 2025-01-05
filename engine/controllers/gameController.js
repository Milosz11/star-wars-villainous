const express = require("express");
const { newGame, loadGame } = require("../routes/gameRoutes");

const router = express.Router();
router.use(express.json());

router.post("/newGame", newGame);

router.get("/loadGame", loadGame);

module.exports = router;
