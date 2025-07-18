const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

function getDB() {
  if (!db) throw new Error("DB not connected yet");
  return db;
}

module.exports = {
  connectDB,
  getDB,
};