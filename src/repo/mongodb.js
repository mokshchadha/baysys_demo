const { MongoClient } = require("mongodb");
const configs = require("../../configs");

class MongoDBOperations {
  constructor(dbUrl = configs.dbUrl, dbName = configs.dbName) {
    this.dbUrl = dbUrl;
    this.dbName = dbName;
    this.client = new MongoClient(this.dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  async connect() {
    await this.client.connect();
    console.log("Connected successfully to MongoDB - dbName:", this.dbName);
    this.db = this.client.db(this.dbName);
  }

  async findOne(collectionName, query) {
    return await this.db.collection(collectionName).findOne(query);
  }

  async findOneAndUpdate(collectionName, filter, update, options = {}) {
    return await this.db
      .collection(collectionName)
      .findOneAndUpdate(filter, update, options);
  }

  async disconnect() {
    await this.client.close();
    console.log("Disconnected from MongoDB");
  }
}

const instance = new MongoDBOperations();

instance.connect();

module.exports = instance;
