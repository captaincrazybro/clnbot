const { MongoClient } = require("mongodb");
require("dotenv").config();

let MongoUtil = class {
  #dbName = "clnbot";
  #url;
  #db;
  #client;
  constructor(url) {
    if (url) {
      this.#url = url;
    } else {
      this.#url = process.env.MONGO_URL;
    }
    this.#client = new MongoClient(this.#url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  async connect() {
    try {
      await this.#client.connect();
      this.#db = this.#client.db(this.#dbName);
      console.log(`Connected to database ${this.#db.databaseName}`);
    } catch (e) {
      console.log(e);
    }
  }
  get db() {
    return this.#db;
  }

  close() {
    this.#client.close();
  }
};

module.exports = { MongoUtil };
