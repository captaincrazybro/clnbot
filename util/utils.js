const { MongoClient } = require("mongodb");

// connecton url to the db
const url = process.env.MONGO_URL;

// Database Name
const dbName = "clnbot";

// Connection
const connectMongo = async (action) => {
  const client = new MongoClient(url);

  try {
    await client.connect();

    const db = client.db(dbName);

    console.log(`Connect to database ${db.databaseName}`);
    //code;
    return await action(db); //, client); maybe later for other functions
  } catch (e) {
    console.log(e);
  } finally {
    client.close();
  }
};

module.exports = { connectMongo };
