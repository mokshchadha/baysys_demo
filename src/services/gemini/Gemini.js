const { GenerativeAI } = require("@google/generative-ai");
const generativeAI = GenerativeAI({
  apiKey: "YOUR_API_KEY",
});

const model = generativeAI.getGenerativeModel({ model: "gemini-pro" });

const Gemini = {
  sendReq() {},
};

module.exports = Gemini;
