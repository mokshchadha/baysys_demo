const fs = require("fs");
const csv = require("csv-parser");

const fileName = "March_24_Sprint.csv";
const filePath = __dirname + "/" + fileName;

const formatData = function (data) {
  return {
    payer: data["Payer"],
    plan: data["Plan"],
    paForm: data["PA Form"],
    policy: data["Policy"],
    CPT: data["CPT"],
    caseStatus: data["Case Status"],
    reasonForDecision: data["Reason for Decision"],
    EHR: data["EHR"],
    additionalInfo: data["Additional Info"],
    medicalDocuments: data["Medical Documents"],
  };
};

async function getFileData(csvFilePath = filePath) {
  return new Promise((resolve, reject) => {
    const dataArray = [];
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        dataArray.push(formatData(row));
      })
      .on("end", () => {
        resolve(dataArray);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

module.exports = { getFileData };
