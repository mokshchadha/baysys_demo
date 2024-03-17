const PDFService = require("./services/pdf/PdfService");
const GPT = require("./services/gpt/ChatGpt");
const DB = require("./data/FileDB");
const mongoDB = require("./repo/mongodb");

async function evaluateJSONschemaforalldata() {
  const data = await getFileData();
  const results = [];
  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    try {
      const r = await evaluateJsonSchemaForEHRPolicy(d);
      console.log(r);
      results.push(r);
    } catch (error) {
      console.error("Error evaluateJSONschemaforalldata() at idx", i);
      // console.error(error);
    }
  }
  await mongoDB.insertMany(mongoDB.collections.PAForm_EHR_Mapping, results);
}

async function evalualtePolicy(data) {
  const policyStatement = await PDFService.downloadAndReadPDF({
    url: data.policy,
    type: "policy",
  });

  const relationalExpressionForPolicy = await getRelationalAlgebraForPolicy({
    policyText: policyStatement,
    CPT: data.CPT,
    payer: data.payer,
  });

  //   const paFormText = await PDFService.downloadAndReadPDF({ url: data.paForm });
  //   const filledForm = await GPT.fillFormForPatient(paFormText, data.EHR);

  //   const stepByStepAnalysis = await GPT.comparePersonPolicyAndForm(
  //     filledForm,
  //     policyStatement
  //   );

  const finalAnalysis = await GPT.isPolicyApplicableV2(
    data.EHR,
    policyStatement,
    data.additionalInfo
  );

  return {
    myStatus: finalAnalysis.status,
    myReason: finalAnalysis.reason,
    correctStatus: data.caseStatus,
    reason: data.reasonForDecision,
  };
}

async function evaluateJsonSchemaForEHRPolicy(data) {
  const paFormText = await PDFService.downloadAndReadPDF({ url: data.paForm });
  const jsonMapping = await EHRMappingForPolicy({
    paFormText,
    CPT: data.CPT,
    payer: data.payer,
  });
  return {
    id: formatUniqId(data.CPT, data.payer),
    ...jsonMapping,
  };
}

async function EHRMappingForPolicy({ paFormText, CPT, payer }) {
  const uniqId = formatUniqId(CPT, payer);
  await mongoDB.connect();
  // const data = await mongoDB.getPolicyEHRMapping(uniqId);
  // if (data) return data;
  const mapping = await GPT.convertPAFormDataToJSON(paFormText);
  console.log({ mapping: JSON.stringify(mapping, null, 2) });
  return mapping;
}

async function getRelationalAlgebraForPolicy({ policyText, CPT, payer }) {
  const uniqId = formatUniqId(CPT, payer);
  const dataInDB = await DB.get(uniqId);
  if (dataInDB) return dataInDB;
  const relationalAlgebra = await GPT.convertPolicyToRelationalExpression(
    policyText
  );
  await DB.set(uniqId, relationalAlgebra);
  return relationalAlgebra;
}

function formatUniqId(CPT, payer) {
  return payer.split(" ").join("_") + "_" + CPT;
}

module.exports = { evalualtePolicy };
