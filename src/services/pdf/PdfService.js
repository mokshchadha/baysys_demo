const fs = require("fs");
const pdfParse = require("pdf-parse");
const path = require("path");

const PDFService = {
  async downloadPDF(pdfURL, outputFilePath) {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(pdfURL);
    const buffer = await response.buffer();
    fs.writeFileSync(outputFilePath, buffer);
    // console.log("PDF downloaded");
  },

  async readPDF(filePath, type) {
    const dataBuffer = fs.readFileSync(filePath);
    try {
      const data = await pdfParse(dataBuffer);
      if (type === "policy") {
        const beforeGuidelines = data.text.split("Policy Guidelines")[0].trim();
        return beforeGuidelines;
      }
      return data.text.trim();
    } catch (error) {
      console.error("Error parsing the PDF:", error);
    }
  },

  async downloadAndReadPDF({ url, type }) {
    const outputFilePath = path.join(__dirname, "downloaded.pdf");
    await this.downloadPDF(url, outputFilePath);
    return this.readPDF(outputFilePath, type);
  },
};

module.exports = PDFService;
