const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../../../configs");
const generativeAI = new GoogleGenerativeAI(config.geminiKey);

const model = generativeAI.getGenerativeModel({ model: "gemini-pro" });

const Gemini = {
  async ask(prompt) {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();
    return generatedText;
  },
};

module.exports = Gemini;
