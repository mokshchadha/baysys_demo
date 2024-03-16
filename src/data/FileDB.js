const fs = require("fs").promises;
const path = require("path");

const dbFilePath = path.join(__dirname, "db.json");

const SimpleFileDB = {
  async initialize() {
    try {
      await fs.access(dbFilePath);
    } catch (error) {
      await fs.writeFile(dbFilePath, JSON.stringify({}), "utf8");
    }
  },

  async set(key, data) {
    try {
      const fileContent = await fs.readFile(dbFilePath, "utf8");
      const db = JSON.parse(fileContent);
      db[key] = data;
      console.log({ data });
      await fs.writeFile(dbFilePath, JSON.stringify(db, null, 2), "utf8");
      console.log(`Data set for key: ${key}`);
    } catch (error) {
      console.error("Error setting data:", error);
    }
  },

  async get(key) {
    try {
      const fileContent = await fs.readFile(dbFilePath, "utf8");
      const db = JSON.parse(fileContent);
      return db[key] ? db[key] : null; // Return the data for the key, or null if not found
    } catch (error) {
      console.error("Error retrieving data:", error);
      return null;
    }
  },

  async delete(key) {
    try {
      const fileContent = await fs.readFile(dbFilePath, "utf8");
      const db = JSON.parse(fileContent);
      if (db[key]) {
        delete db[key]; // Delete the data for the key
        await fs.writeFile(dbFilePath, JSON.stringify(db, null, 2), "utf8");
        console.log(`Data deleted for key: ${key}`);
      } else {
        console.log("Key not found.");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  },
};

module.exports = SimpleFileDB;
