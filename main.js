const { getFileData } = require("./src/data/FileData");
const path = require("path");
// const { evalualtePolicy } = require("./src/app");
// const mongoDB = require("./src/repo/mongodb");
const PDFService = require("./src/services/pdf/PdfService");
const { getPolicyStatementMapping } = require("./src/routes/logics");

async function main() {
  const data = await getFileData();

  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    const uuid = crypto.randomUUID();
    const fileName = `idx_${i}_paForm_${uuid}.pdf`;
    const outputPath = path.join(__dirname + "/paFormsPdfs", fileName);
    try {
      await PDFService.downloadPDF(d.paForm, outputPath);
    } catch (error) {
      console.log("Could not load ", i);
    }
  }

  // await mongoDB.emptyResults();
  // const results = [];

  // for (let i = 0; i < data.length; i++) {
  //   const d = data[i];
  //   try {
  //     const r = await getPolicyStatementMapping({
  //       body: {
  //         CPT: d.CPT,
  //         payer: d.payer,
  //         policy: { url: d.policy },
  //       },
  //     });
  //     console.log(r);
  //     results.push(r);
  //   } catch (error) {
  //     console.error("Error evalualtePolicy() at idx", i);
  //     // console.error(error);
  //   }
  // }

  // // await mongoDB.storeResults(results);
  // const matching = await results.filter(
  //   (e) => e.myStatus.toLowerCase() == e.correctStatus.toLowerCase()
  // );
  // console.log({ total: results.length, matching: matching.length });
}

main(); // function call for main
