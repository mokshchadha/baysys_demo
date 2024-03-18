const { formatUniqId } = require("../utils");
const mongodb = require("../repo/mongodb");
const PDF = require("../services/pdf/PdfService");
const GPT = require("../services/gpt/ChatGpt");
const bodyValidators = require("./validators");

async function evaluatePolicyForEndUser(req) {
  bodyValidators.evaluatePolicyForEndUser(req.body);
  const { CPT, payer, policy, person } = req.body;
  const id = formatUniqId(CPT, payer);

  const policyStatement = await getPolicyText(policy);
  const relationalExpressionForPolicy = await getRelationalAlgebraForPolicy({
    policyText: policyStatement,
    id,
  });

  const paFormText = await PDF.downloadAndReadPDF({ url: person.paForm });
  const filledForm = person.EHR
    ? await GPT.fillFormForPatient(paFormText, person.EHR)
    : paFormText;

  const stepByStepAnalysis = await GPT.comparePersonPolicyAndForm(
    filledForm,
    policyStatement
  );

  const finalAnalysis = await GPT.isPolicyApplicableV2(
    filledForm,
    relationalExpressionForPolicy,
    person.additionalInformation
  );

  return {
    status: finalAnalysis.status,
    reason: finalAnalysis.reason,
    steps: stepByStepAnalysis,
  };
}

async function getPolicyStatementMapping(req) {
  const { CPT, payer, policy } = req.body;
  if (!CPT || !payer || !policy) throw "Invalid request body";
  const { url, text } = policy;

  const id = formatUniqId(CPT, payer);
  const data = await mongodb.findOne(
    mongodb.collections.policyStatementMapping,
    {
      id,
    }
  );
  if (data) return data;

  let policyText;
  if (url) {
    policyText = await PDF.downloadAndReadPDF({ url: url, type: "policy" });
  }
  if (text) policyText = text;

  if (!text) throw "Invalid Policy, please add url or text";

  const mapping = await GPT.convertPolicyDataToJson(policyText);
  await mongodb.insertOne(mongodb.collections.policyStatementMapping, {
    id,
    mapping,
  });
  return mapping;
}

async function getRelationalExpression(req) {
  const { CPT, payer, policy } = req.body;
  if (!CPT || !payer || !policy) throw "Invalid request body";
  const { url, text } = policy;

  const id = formatUniqId(CPT, payer);
  const data = await mongodb.findOne(mongodb.collections.policiesRelations, {
    id,
  });
  if (data) return data;

  let policyText;
  if (url) {
    policyText = await PDF.downloadAndReadPDF({ url: url, type: "policy" });
  }
  if (text) policyText = text;

  if (!text) throw "Invalid Policy, please add url or text";

  const relation = await GPT.convertPolicyToRelationalExpression(policyText);
  await mongodb.insertOne(mongodb.collections.policyStatementMapping, {
    id,
    relation,
  });
  return relation;
}

async function getPolicyText(policy) {
  const { url, text } = policy;
  let policyText;
  if (url) {
    policyText = await PDF.downloadAndReadPDF({ url: url, type: "policy" });
  }
  if (text) policyText = text;

  if (!text) throw "Invalid Policy, please add url or text";
  return policyText;
}

async function getRelationalAlgebraForPolicy({ policyText, id }) {
  const data = await mongodb.findOne(mongodb.collections.policiesRelations, {
    id,
  });
  if (data) return data.relation;
  const relation = await GPT.convertPolicyToRelationalExpression(policyText);
  await mongodb.insertOne(mongodb.collections.policiesRelations, {
    id,
    relation,
  });
  return relation;
}

module.exports = {
  getPolicyStatementMapping,
  getRelationalExpression,
  evaluatePolicyForEndUser,
};
