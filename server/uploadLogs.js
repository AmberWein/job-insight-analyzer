require("dotenv").config();
const { MongoClient } = require("mongodb");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function uploadLogs() {
  try {
    const response = await fetch('https://storage.googleapis.com/feeds-json/feeds/transformedFeeds.json');

    if (!response.ok) {
      throw new Error(`Failed to fetch logs: ${response.status} ${response.statusText}`);
    }

    const logs = await response.json();

    console.log(`Got ${logs.length} logs from remote.`);

    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db();
    const collection = db.collection('logs');

    await collection.deleteMany({});

    const result = await collection.insertMany(logs);

    console.log(`Inserted ${result.insertedCount} logs into MongoDB.`);

    await client.close();
  } catch (err) {
    console.error("Error uploading logs:", err);
  }
}

uploadLogs();