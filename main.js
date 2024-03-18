const { getFileData } = require("./src/data/FileData");
// const { evalualtePolicy } = require("./src/app");
// const mongoDB = require("./src/repo/mongodb");
// const PDFService = require("./src/services/pdf/PdfService");
const { getPolicyStatementMapping } = require("./src/routes/logics");

async function main() {
  const data = await getFileData();

  // await mongoDB.emptyResults();
  const results = [];

  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    try {
      const r = await getPolicyStatementMapping({
        body: {
          CPT: d.CPT,
          payer: d.payer,
          policy: { url: d.policy },
        },
      });
      console.log(r);
      results.push(r);
    } catch (error) {
      console.error("Error evalualtePolicy() at idx", i);
      // console.error(error);
    }
  }

  // // await mongoDB.storeResults(results);
  // const matching = await results.filter(
  //   (e) => e.myStatus.toLowerCase() == e.correctStatus.toLowerCase()
  // );
  // console.log({ total: results.length, matching: matching.length });
}

main(); // function call for main
