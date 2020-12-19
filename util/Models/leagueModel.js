//maybe this should be different.
class LeagueModel {
  constructor(db) {
    this.collection = db.collection("users");
  }
  async addLeague(league, serverID) {
    if (typeof league != "string") {
      console.log("League is not a String");
      return null;
    }
    if (typeof serverID != "number") {
      console.log("Server ID is not a string");
      return null;
    }
    if (!league || !serverID) {
      console.log("No league or server ID given");
      return null;
    }
    const newLeague = await this.collection.insertOne(user);
    return newLeague;
  }
}
module.exports = LeagueModel;
