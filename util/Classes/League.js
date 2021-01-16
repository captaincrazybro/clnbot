const MongoUtil = require("../MongoUtils/MongoUtil");
const { leagueSchema } = require("../Models/LeagueModel");
const { validateModelValues } = require("../MongoUtils/ValidateModels");
class League {
  #collectionName = "leagues";
  #projectAllStage = {
    $project: {
      _id: 0, //maybe we should use this.
      leagueId: 1,
      name: 1,
    },
  };
  #sortByNameStage = {
    $sort: { name: 1 },
  };
  #sortByDiscordServerIdStage = {
    $sort: { discordServerId: 1 },
  };
  #unionWithServerStage = [
    {
      $lookup: {
        from: "servers",
        localField: "leagueId",
        foreignField: "currentLeagueId",
        as: "servers",
      },
    },
    {
      $unwind: {
        path: "$servers",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        leagueId: 1,
        serverId: "$servers.serverId",
        discordServerId: "$servers.discordServerId",
      },
    },
  ];
  //must recieve an answer and max time for it should be 5 seconds
  #transactionlessWriteConcern = { w: 1, j: true, wtimeout: 5000 };
  constructor() { }
  /**
   * This function looks for all the unique leagues in the db and returns a list of them.
   * @returns {Array} A sorted array (by name) of objects that have the name and leagueId of the league.
   */
  async getLeagues() {
    return await MongoUtil.action(async (db) => {
      let leagues;
      const leaguesCollection = db.collection(this.#collectionName);
      const cursorLeagues = await leaguesCollection.aggregate([
        this.#sortByNameStage,
      ]);
      leagues = await cursorLeagues.toArray();
      return leagues;
    });
  }
  /**
   * This function looks for all the servers related to the league's name in the db and returns a list of them.
   * @returns {Array} A sorted array (by name) of objects that have the name of the league.
   */
  async getLeagueServersWithName(inputName) {
    if (typeof inputName != "string" || !inputName) {
      console.log("Name is not a String ", inputName);
      return null;
    }
    return await MongoUtil.action(async (db) => {
      const leaguesCollection = db.collection(this.#collectionName);
      const cursorLeagues = await leaguesCollection.aggregate([
        {
          $match: { name: new RegExp(inputName, 'i') },
        },
        ...this.#unionWithServerStage,
        this.#sortByDiscordServerIdStage,
      ]);
      return await cursorLeagues.toArray();
    });
  }
  /**
   * This function looks for all the servers related to the league's id in the db and returns a list of them.
   * @returns {Array} A sorted array (by name) of objects that have the name of the league.
   */
  async getLeagueServersWithId(inputLeagueId) {
    if (typeof inputLeagueId != "number" || !inputLeagueId) {
      console.log("Name is not a number ", inputLeagueId);
      return null;
    }
    return await MongoUtil.action(async (db) => {
      let leagues;
      const leaguesCollection = db.collection(this.#collectionName);
      const cursorLeagues = await leaguesCollection.aggregate([
        {
          $match: { leagueId: inputLeagueId },
        },
        ...this.#unionWithServerStage,
        this.#sortByDiscordServerIdStage,
      ]);
      leagues = await cursorLeagues.toArray();
      return leagues;
    });
  }
  /**
   * This function finds a league by the Object id.
   * @param {String} id This is the mongo Object id sought.
   * @returns {Array} The league and the id of the league
   */
  async getLeagueById(id) {
    if (typeof id != "number" || !id) {
      console.log("Name is not a number ", id);
      return null;
    }
    return await MongoUtil.action(async (db) => {
      let league;
      const leagueCollection = db.collection(this.#collectionName);
      const cursorLeague = await leagueCollection.aggregate([
        {
          $match: {
            leagueId: id,
          },
        },
        this.#projectAllStage,
      ]);

      league = await cursorLeague.toArray();
      return league;
    });
  }
  /**
   * This function finds a league by the name.
   * @param {String} name This is the server id sought.
   * @returns {Array} The array returned has 3 keys, the id, name, and server id.
   */
  async getLeagueByName(intputName) {
    if (typeof intputName != "string" || !intputName) {
      console.log("Name is not a String ", intputName);
      return null;
    }
    return await MongoUtil.action(async (db) => {
      const leagueCollection = db.collection(this.#collectionName);
      //searches in the db the league. 
      const cursorLeague = await leagueCollection.aggregate([
        {
          $match: {
            name: new RegExp(intputName, 'i'),
          },
        },
        this.#projectAllStage,
        this.#sortByNameStage,
      ]);

      return await cursorLeague.toArray();
    });
  }

  /**
   * Returns the max League id
   * @returns {Number} Max League Id
   */
  async getMaxLeagueId() {
    return await MongoUtil.action(async (db) => {
      const leaguesCollection = db.collection(this.#collectionName);
      const cursorMaxId = await leaguesCollection.aggregate([
        {
          '$group': {
            '_id': null,
            'maxId': {
              '$max': '$leagueId'
            }
          }
        }
      ]);
      return (await cursorMaxId.toArray())[0].maxId;
    });
  }
  /**
   * This function Adds a league.
   * @param {String} name This is the name for the new server.
   *
   */
  async addLeague({ name: newName, fullName: newFullName }) {
    if (typeof newName != "string" || !newName) {
      console.log("Name is not a String ", newName);
      return null;
    }
    if (typeof newFullName != "string" || !newFullName) {
      console.log("Full Name is not a String ", newFullName);
      return null;
    }
    if ((await this.getLeagueByName(newName)).length > 0) {
      console.log("A league with that name already Exists.")
      return null;
    }
    //Capitalize Every word.
    const words = newFullName.toLowerCase().split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    newFullName = words.join(" ");

    let newId = (await this.getMaxLeagueId()) + 1;
    let league = {
      leagueId: newId,
      name: newName.toUpperCase(),
      fullName: newFullName,
      isActive: true
    };
    return await MongoUtil.action(async (db) => {
      const leaguesCollection = db.collection(this.#collectionName);
      try {
        if (!validateModelValues(leagueSchema, league)) throw new Error("League Error - Invalid Values for the model");
        const newName = await leaguesCollection.insertOne(
          league,
          this.#transactionlessWriteConcern
        );
        return {
          insertedId: newName.insertedId,
          insertedCount: newName.insertedCount,
        }; //maybe?? if not then send league info
      } catch (MongoError) {
        console.log(MongoError);
        //error handling for dupe and possibly other errors.
        if (MongoError.code == 11000) {
          console.log("Dup key", MongoError.keyValue);
          //this is what i'm sending, but it could also be null.
          return {
            insertedId: newServerId,
            insertedCount: 0,
          };
        } else {
          throw new Error("Unexpected Error", MongoError);
        }
      }
    });
  }

  async updateLeagueById({ leagueId, name: newName, fullName: newFullName }) {
    if (typeof (newName) != "string") {
      console.log("Name is not a String");
      return null;
    }
    if (typeof (newFullName) != "string") {
      //maybe this should be a number?
      console.log("Server ID is not a number");
      return null;
    }
    if (!newName || !newFullName) {
      console.log("No league or server ID given");
      return null;
    }
    newName = newName.toUpperCase();

    //Capitalize Every word.
    const words = newFullName.toLowerCase().split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    newFullName = words.join(" ");

    if (await this.getLeagueById(leagueId)) {
      let filter = { leagueId: leagueId },
        update = {
          $set: { name: newName, fullName: newFullName }
        },
        options = {
          upsert: false //creates new doc if not found
          //   multi: false, default is false (multi update.)
        };

      return await MongoUtil.action(async (db) => {
        const leaguesCollection = db.collection(this.#collectionName);
        const newName = await leaguesCollection.updateOne(filter, update, options);
        // console.log(newName);
        return {
          n: newName.result.n,
          nModified: newName.result.nModified,
          ok: newName.result.ok,
        };
      });
    }
    else {
      return {
        modifiedCount: 0,
        message: 'League does not exist.',
        numberFound: 0,
      };
    }
  }
}
module.exports = new League();
