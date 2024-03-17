require("dotenv").config();

const Configs = {
  chatGPTKey: process.env.CHAT_GPT_KEY,
  dbUrl: process.env.MONGO_URL,
  dbName: process.env.DB_NAME,
};

module.exports = Configs;
