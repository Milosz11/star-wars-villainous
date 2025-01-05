const express = require("express");
const loadGame = require("../routes/loadGame");
const newGame = require("../routes/newGame");

const router = express.Router();
router.use(express.json());

router.get("/loadGame", loadGame);

router.post("/newGame", newGame);

module.exports = router;
