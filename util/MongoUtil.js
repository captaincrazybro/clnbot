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
  }
  async connect() {
    this.#client = new MongoClient(this.#url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await this.#client.connect();
      this.#db = this.#client.db(this.#dbName);
      // console.log(`Connected to database ${this.#db.databaseName}`); to check when the db is connecting
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

  async action(callback) {
    await this.connect();
    let value = await callback(this.#db);
    this.close();
    return value;
  }
};

//different ways of using the Mongo Util
//v1
// let mongoUtil = new MongoUtil();
// await mongoUtil.connect();
// let db = mongoUtil.db;
// //add collection to object
// const leaguesCollection = db.collection("leagues");
// //searches in the db the leagues.
// const cursorLeagues = await leaguesCollection.aggregate({
//   project: {
//     league: 1,
//   },
// });
// leagues = await cursorLeagues.toArray();
// mongoUtil.close();

//v2
// leagues = await MongoUtil.action(async (db) => {
//   let leagues;
//   const leaguesCollection = db.collection("leagues");
//   //searches in the db the leagues.
//   const cursorLeagues = await leaguesCollection.aggregate({
//     project: {
//       league: 1,
//     },
//   });
//   leagues = await cursorLeagues.toArray();
//   return leagues;
// });

//v3
// let leagues = await LeagueModel.getLeagues();

// let test = await LeagueModel.addLeague({
//   league: "test",
//   serverID: "32948723049827420983472039",
// });
// console.log(leagues);

module.exports = new MongoUtil();
