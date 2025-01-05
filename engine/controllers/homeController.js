const express = require("express");
const { home } = require("../routes/homeRoutes");

const router = express.Router();

router.get("/", home);

module.exports = router;
