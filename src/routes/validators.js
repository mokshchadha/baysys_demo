const BODY_ERR = "Invalid request body";

function evaluatePolicyForEndUser(body) {
  const { CPT, payer, policy, person } = req.body;
  if (!CPT || !payer || !policy) throw BODY_ERR;
  const { url, text } = policy;
  if (!url && !text) throw BODY_ERR;
  const { EHR, paForm } = person;
  if (!EHR && !paForm) throw BODY_ERR;
}

function getPolicyStatementMapping(body) {}

function getRelationalExpression(body) {}

module.exports = {
  evaluatePolicyForEndUser,
  getPolicyStatementMapping,
  getRelationalExpression,
};
