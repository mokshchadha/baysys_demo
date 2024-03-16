const { getFileData } = require("./src/data/FileData");
const PDFService = require("./src/services/pdf/PdfService");
const GPT = require("./src/services/gpt/ChatGpt");
const DB = require("./src/data/FileDB");

async function main() {
  const data = await getFileData();
  const d = data[0];
  const resp = await PDFService.downloadAndReadPDF({
    url: d.policy,
    type: "policy",
  });

  const relationalAlgerbra = await getRelationalAlgebraForPolicy({
    policyText: resp,
    CPT: d.CPT,
    payer: d.payer,
  });

  console.log({ relationalAlgerbra });
}

main();

///========================================= auxilaries ==============================
async function getRelationalAlgebraForPolicy({ policyText, CPT, payer }) {
  //NOTE: this functions checks if we have already computed the relational algebric expression for the payer and CPT
  // if yes we return it else we ask ChatGPT and return and store it for future use cases
  const uniqId = payer.split(" ").join("_") + "_" + CPT;
  const dataInDB = await DB.get(uniqId);
  if (dataInDB) return dataInDB;
  const relationalAlgebra = await GPT.convertPolicyToRelationalArgument(
    policyText
  );
  await DB.set(uniqId, relationalAlgebra);
  return relationalAlgebra;
}
