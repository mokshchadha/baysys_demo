const { getFileData } = require("./src/data/FileData");
const PDFService = require("./src/services/pdf/PdfService");
const GPT = require("./src/services/gpt/ChatGpt");
const DB = require("./src/data/FileDB");

async function main() {
  const data = await getFileData();
  const d = data[0];
  const policyStatement = await PDFService.downloadAndReadPDF({
    url: d.policy,
    type: "policy",
  });

  const relationalExpressionForPolicy = await getRelationalAlgebraForPolicy({
    policyText: policyStatement,
    CPT: d.CPT,
    payer: d.payer,
  });

  const paFormText = await PDFService.downloadAndReadPDF({ url: d.paForm });
  const filledForm = await GPT.fillFormForPatient(paFormText, d.EHR);

  const finalAnalysis = await GPT.isPolicyApplicable(
    filledForm,
    relationalExpressionForPolicy
  );

  console.log({ finalAnalysis });
}

main();

///========================================= auxilaries ==============================
async function getRelationalAlgebraForPolicy({ policyText, CPT, payer }) {
  //NOTE: this functions checks if we have already computed the relational algebric expression for the payer and CPT
  // if yes we return it else we ask ChatGPT and return and store it for future use cases
  const uniqId = payer.split(" ").join("_") + "_" + CPT;
  const dataInDB = await DB.get(uniqId);
  if (dataInDB) return dataInDB;
  const relationalAlgebra = await GPT.convertPolicyToRelationalExpression(
    policyText
  );
  await DB.set(uniqId, relationalAlgebra);
  return relationalAlgebra;
}
