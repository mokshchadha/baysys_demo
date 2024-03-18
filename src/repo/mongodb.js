const { MongoClient } = require("mongodb");
const configs = require("../../configs");

class MongoDBOperations {
  constructor(dbUrl = configs.dbUrl, dbName = configs.dbName) {
    this.dbUrl = dbUrl;
    this.dbName = dbName;
    this.collections = {
      PAForm_EHR_Mapping: "PAForm_EHR_Mapping",
      resultsCollection: "resultsCollection",
      policiesRelations: "policiesRelations",
      policyStatementMapping: "policyStatementMapping",
    };
    this.client = new MongoClient(this.dbUrl, {});
  }

  async connect() {
    await this.client.connect();
    console.log("Connected successfully to MongoDB - dbName:", this.dbName);
    this.db = this.client.db(this.dbName);
  }

  async findOne(collectionName, query) {
    return await this.db.collection(collectionName).findOne(query);
  }

  async findOneAndUpdate(
    collectionName,
    filter,
    update,
    options = { upsert: true }
  ) {
    return await this.db
      .collection(collectionName)
      .findOneAndUpdate(filter, update, options);
  }

  async insertMany(collection, results) {
    if (!results || results.length === 0) return;
    if (!this.db) await this.connect();
    return this.db.collection(collection).insertMany(results);
  }

  async insertOne(collection, result) {
    if (!result) return;
    if (!this.db) await this.connect();
    return this.db.collection(collection).insertOne(result);
  }

  async disconnect() {
    await this.client.close();
    console.log("Disconnected from MongoDB");
  }

  async getPolicyEHRMapping(id) {
    return await this.db
      .collection(this.collections.POLICIES_EHR_Mapping)
      .findOne({ id });
  }

  async storePolicyEHRMapping(id, mapping) {
    if (id && mapping)
      return this.db
        .collection(this.collections.POLICIES_EHR_Mapping)
        .insertOne({ id, mapping });
  }

  async emptyResults() {
    if (!this.db) await this.connect();
    return this.db
      .collection(this.collections.resultsCollection)
      .deleteMany({});
  }

  async storeResults(results) {
    if (!results || results.length === 0) return;
    if (!this.db) await this.connect();
    return this.db
      .collection(this.collections.resultsCollection)
      .insertMany(results);
  }

  async find(collection, query = {}) {
    if (!this.db) await this.connect();
    return this.db.collection(collection).find(query).toArray();
  }
}

const instance = new MongoDBOperations();

// instance.connect();

module.exports = instance;
