const express = require("express");
const router = express.Router();
const handler = require("./handler");
const {
  getPolicyStatementMapping,
  getRelationalExpression,
} = require("./logics");

router.post("/evaluatePolicyForEndUser", (req, res) => {
  res.status(200).send("Policy evaluated");
});

router.post("/getPolicyStatementMapping", (r, rs) =>
  handler(r, rs, getPolicyStatementMapping)
);

router.post("/getRelationalExpression", (r, rs) =>
  handler(r, rs, getRelationalExpression)
);

module.exports = router;
