const express = require("express");
const router = express.Router();
const handler = require("./handler");
const {
  getPolicyStatementMapping,
  getRelationalExpression,
  evaluatePolicyForEndUser,
} = require("./logics");

router.post("/evaluatePolicyForEndUser", (req, res) =>
  handler(req, res, evaluatePolicyForEndUser)
);

router.post("/policyStatementMapping", (r, rs) =>
  handler(r, rs, getPolicyStatementMapping)
);

router.post("/relationalExpressionForPolicy", (r, rs) =>
  handler(r, rs, getRelationalExpression)
);

module.exports = router;
