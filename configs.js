require("dotenv").config();

const Configs = {
  chatGPTKey: process.env.CHAT_GPT_KEY,
  dbUrl: process.env.MONGO_URL,
  dbName: process.env.DB_NAME,
  AUTH_KEY: process.env.AUTH_KEY,
  geminiGPTKey: process.env.GEMINI_KEY,
};

module.exports = Configs;
