const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

const gameRouter = require("../controllers/gameController");

app.use("/game", gameRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
