const MongoUtil = require("../MongoUtil");
const { ObjectId } = require("mongodb");
class LeagueModel {
  #collectionName = "leagues";
  #projectAllStage = {
    $project: {
      _id: 1, //maybe we should use this.
      name: 1,
      serverId: 1,
    },
  };
  #sortByNameStage = {
    $sort: { name: 1 },
  };
  #sortByDiscordServerIdStage = {
    $sort: { discordServerId: 1 },
  };
  #unionWithServerModelStage = [
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
        _id: 1,
        name: 1,
        leagueId: 1,
        serverId: "$servers.serverId",
        discordServerId: "$servers.discordServerId",
      },
    },
  ];
  constructor() {}
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
  async getLeagueServers(inputName) {
    if (typeof inputName != "string" || !inputName) {
      console.log("Name is not a String ", inputName);
      return null;
    }
    intputName = intputName.toLowerCase();
    return await MongoUtil.action(async (db) => {
      let leagues;
      const leaguesCollection = db.collection(this.#collectionName);
      const cursorLeagues = await leaguesCollection.aggregate([
        {
          $match: { name: inputName },
        },
        ...this.#unionWithServerModelStage,
        this.#sortByDiscordServerIdStage,
      ]);
      leagues = await cursorLeagues.toArray();
      return leagues;
    });
  }
  /**
   * This function looks for all the servers related to the league's id in the db and returns a list of them.
   * @returns {Array} A sorted array (by name) of objects that have the name of the league.
   */
  async getLeagueServers(inputLeagueId) {
    if (typeof inputLeagueId != "number" || !inputLeagueId) {
      console.log("Name is not a number ", inputLeagueId);
      return null;
    }
    intputName = intputName.toLowerCase();
    return await MongoUtil.action(async (db) => {
      let leagues;
      const leaguesCollection = db.collection(this.#collectionName);
      const cursorLeagues = await leaguesCollection.aggregate([
        {
          $match: { leagueId: inputLeagueId },
        },
        ...this.#unionWithServerModelStage,
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
    intputName = intputName.toLowerCase();
    return await MongoUtil.action(async (db) => {
      let league;
      const leagueCollection = db.collection(this.#collectionName);
      //searches in the db the league.

      const cursorLeague = await leagueCollection.aggregate([
        {
          $match: {
            name: intputName,
          },
        },
        this.#projectAllStage,
        this.#sortByNameStage,
      ]);

      league = await cursorLeague.toArray();
      return league;
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
          $group: {
            _id: null,
            maxId: { $max: "$leagueId" },
          },
        },
      ]);
      return (await cursorMaxId).maxId;
    });
  }
  /**
   * This function Adds a league.
   * @param {String} name This is the name for the new server.
   *
   */
  async addLeague({ name: newName }) {
    if (typeof newName != "string" || !newName) {
      console.log("Name is not a String ", newName);
      return null;
    }
    let league = {
      name: newName.toLowerCase(),
    };
    return await MongoUtil.action(async (db) => {
      const leaguesCollection = db.collection(this.#collectionName);
      try {
        const newName = await leaguesCollection.insertOne(league);
        return {
          insertedId: newName.insertedId,
          insertedCount: newName.insertedCount,
        }; //maybe?? if not then send league info
      } catch (MongoError) {
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

  async updateLeague({ name: newName, serverId: newServerId }) {
    if (typeof newName != "string") {
      console.log("League is not a String");
      return null;
    }
    if (typeof newServerId != "number") {
      //maybe this should be a number?
      console.log("Server ID is not a number");
      return null;
    }
    if (!newName || !newServerId) {
      console.log("No league or server ID given");
      return null;
    }
    newName = newName.toLowerCase();
    // let { _id } = this.getLeagueByServerId(newServerId);
    // console.log("Id", _id);
    let query = { $serverId: serverId },
      update = { name: newName };
    options = {
      upsert: true, //creates new doc if not found
      //   multi: false, default is false (multi update.)
    };

    return await MongoUtil.action(async (db) => {
      const leaguesCollection = db.collection(this.#collectionName);
      const newName = await leaguesCollection.update(query, update, options);
      console.log(newName);
      return {
        updatedId: newName.updatedId,
        updatedCount: newName.updatedCount,
        modifiedCount: newName.nModified,
        addedCount: newName.nUpserted,
        numberFound: newName.nMatched,
      }; //maybe?? if not then league.
    });
  }
  async resetLeagueByServerId(serverId) {
    return await MongoUtil.action(async (db) => {
      const leaguesCollection = db.collection(this.#collectionName);
      const serverLeague = await leaguesCollection.update(
        query,
        update,
        options
      );
      console.log(serverLeague);
    });
  }
}
module.exports = new LeagueModel();
