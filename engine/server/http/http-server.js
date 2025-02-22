const express = require("express");
const cors = require("cors");
const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

const gameRouter = require("./controllers/game-controller");

app.use("/game", gameRouter);

module.exports = app;
