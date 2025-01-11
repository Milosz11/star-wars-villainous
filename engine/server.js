const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

const gameRouter = require("./controllers/game-controller");

app.use("/game", gameRouter);

app.listen(port, () => {
    console.log(`Star Wars Villainous engine running on port ${port}`);
});
