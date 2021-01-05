const MongoUtil = include("../MongoUtil");

class ServerModel {
  #collectionName = "servers";

  #sortByCurrentLeagueId = {
    $sort: { currentLeagueId: 1 },
  };

  constructor() {}
  /**
   * This function looks for all the servers in the db and returns a list of them.
   * @returns {Array} A sorted array (by leagueId) of objects that have the name of the league.
   */
  async getServers() {
    return await MongoUtil.action(async (db) => {
      const serversCollection = db.collection(this.#collectionName);
      const cursorLeagues = await serversCollection.aggregate([
        this.#sortByCurrentLeagueId,
      ]);
      //returns the servers
      return await cursorLeagues.toArray();
    });
  }
  /**
   * This function looks for a server by DISCORD server id in the db and returns an object of it.
   * @returns {Array} An array with the server object.
   */
  async getServerByDiscordId(inputDiscordServerId) {
    return await MongoUtil.action(async (db) => {
      const serversCollection = db.collection(this.#collectionName);
      const cursorLeagues = await serversCollection.aggregate([
        {
          $match: {
            discordServerId: inputDiscordServerId,
          },
        },
        this.#sortByCurrentLeagueId,
      ]);
      //returns the servers
      return await cursorLeagues.toArray();
    });
  }
  /**
   * This function looks for a server by server id in the db and returns an object of it.
   * @returns {Array} An array with the server object.
   */
  async getServerById(inputServerId) {
    if (typeof inputServerId != "number") {
      console.log("Server ID is not a Number");
      return null;
    }
    if (!inputServerId) {
      console.log("No league or server ID given");
      return null;
    }
    return await MongoUtil.action(async (db) => {
      const serversCollection = db.collection(this.#collectionName);
      const cursorLeagues = await serversCollection.aggregate([
        {
          $match: {
            serverId: inputServerId,
          },
        },
      ]);
      //returns the servers
      return await cursorLeagues.toArray();
    });
  }
  async getServersLeagueName(inputLeagueName) {
    return await MongoUtil.action(async (db) => {
      const serversCollection = db.collection(this.#collectionName);
      const cursorLeagues = await serversCollection.aggregate([
        {
          $lookup: {
            from: "leagues",
            localField: "currentLeagueId",
            foreignField: "leagueId",
            as: "league",
          },
        },
        {
          $unwind: {
            path: "$league",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            serverId: 1,
            discordServerId: 1,
            currentLeagueId: 1,
            leagueName: "$league.name",
          },
        },
        {
          $match: {
            leagueName: inputLeagueName,
          },
        },
        this.#sortByCurrentLeagueId,
      ]);
      //returns the servers
      return await cursorLeagues.toArray();
    });
  }
  /**
   *
   * @param {Number} discordServerId
   */
  async addServer({ discordServerId: newDiscordServerId }) {
    if (typeof newDiscordServerId != "number") {
      console.log("Server ID is not a Number");
      return null;
    }
    if (!newDiscordServerId) {
      console.log("No server ID given");
      return null;
    }
    return await MongoUtil.action(async (db) => {
      const serversCollection = db.collection(this.#collectionName);
      const newServerId = this.getMaxServerId() + 1;
      const cursorLeagues = await serversCollection.insertOne({
        serverId: newServerId,
        discordServerId: newDiscordServerId,
        currentLeagueId: null,
      });
      //returns the servers
      return await cursorLeagues.toArray();
    });
  }
  /**
   * Adds a server with a league id
   * @param {Number} discordServerId
   * @param {Number} currentLeagueId
   */
  async addServer({
    discordServerId: newDiscordServerId,
    currentLeagueId: newCurrentLeagueId,
  }) {
    if (typeof newCurrentLeagueId != "number") {
      console.log("Name is not a Number");
      return null;
    }
    if (typeof newDiscordServerId != "number") {
      console.log("Server ID is not a Number");
      return null;
    }
    if (newCurrentLeagueId == undefined || !newDiscordServerId) {
      console.log("No league or server ID given");
      return null;
    }
    return await MongoUtil.action(async (db) => {
      const serversCollection = db.collection(this.#collectionName);
      const newServerId = this.getMaxServerId() + 1;
      const cursorLeagues = await serversCollection.insertOne({
        serverId: newServerId,
        discordServerId: newDiscordServerId,
        currentLeagueId: newCurrentLeagueId,
      });
      return await cursorLeagues.toArray();
    });
  }
  /**
   *
   * @param {Number} discordServerId
   * @param {String} currentLeagueName
   */
  async addServer({ discordServerId: newDiscordServerId, currentLeagueName }) {
    if (typeof currentLeagueName != "string" && currentLeagueName != null) {
      console.log("Name is not a String");
      return null;
    }
    if (typeof newDiscordServerId != "number") {
      console.log("Server ID is not a number");
      return null;
    }
    if (currentLeagueName == undefined || !newDiscordServerId) {
      console.log("No league or server ID given");
      return null;
    }
    return await MongoUtil.action(async (db) => {
      const serversCollection = db.collection(this.#collectionName);
      const newServerId = this.getMaxServerId() + 1;
      const cursorLeagues = await serversCollection.aggregate([
        {
          $match: {
            serverId: inputServerId,
          },
        },
        this.#sortByCurrentLeagueId,
      ]);
      return await cursorLeagues.toArray();
    });
  }
  /**
   * Returns the max Server id
   * @returns {Number} Max Server Id
   */
  async getMaxServerId() {
    return await MongoUtil.action(async (db) => {
      const serversCollection = db.collection(this.#collectionName);
      const cursorMaxId = await serversCollection.aggregate([
        {
          $group: {
            _id: null,
            maxId: { $max: "$serverId" },
          },
        },
      ]);
      return (await cursorMaxId).maxId;
    });
  }
  async removeServer() {}
  async resetServerLeague() {}
}

module.exports = new ServerModel();
