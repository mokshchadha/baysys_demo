const express = require("express");
const router = express.Router();
const handler = require("./handler");
const { askGemini } = require("./logics");

router.post("/askGemini", (r, rs) => handler(r, rs, askGemini));

module.exports = router;
