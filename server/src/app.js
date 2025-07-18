require("dotenv").config();
const express = require("express");
const axios = require("axios");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

// external data fetch route
app.get("/api/logs", async (req, res) => {
  try {
    const response = await axios.get(
      "https://storage.googleapis.com/feeds-json/feeds/transformedFeeds.json"
    );
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error("Error fetching remote data:", error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// mongoDB setup
const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
connectDB();

// main chat endpoint
app.post("/api/chat", async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Missing question" });

  const prompt = `
You are an assistant that translates natural language questions about job logs into MongoDB queries.
Return only the MongoDB query object (as valid JSON) that can be used with collection.find().
Do not include JavaScript code such as new Date(). Instead, provide ISO string format, like:
{
  "date": {
    "$gte": "2025-07-07T00:00:00.000Z",
    "$lt": "2025-07-08T00:00:00.000Z"
  }
}
If you cannot generate a query, reply: "UNSUPPORTED".

Question: "${question}"
`;

  try {
    console.log("Prompt sent to Claude via OpenRouter:\n", prompt);

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      console.error("Error response from OpenRouter:", await response.text());
      return res
        .status(response.status)
        .json({ response: "Error from OpenRouter API" });
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      console.error("No response from Claude");
      return res.status(500).json({ response: "No response from Claude." });
    }

    console.log("Response from Claude:", answer);

    if (answer === "UNSUPPORTED") {
      return res.json({ response: "Sorry, I cannot answer that question." });
    }

    let query;
    try {
      const cleaned = answer.replace(
        /new Date\(([^)]+)\)/g,
        (_, dateStr) =>
          `"${new Date(dateStr.replace(/['"]/g, "")).toISOString()}"`
      );
      query = JSON.parse(cleaned);

      if (query.date) {
        if (query.date.$gte && typeof query.date.$gte === "string") {
          query.date.$gte = new Date(query.date.$gte);
        }
        if (query.date.$lt && typeof query.date.$lt === "string") {
          query.date.$lt = new Date(query.date.$lt);
        }
      }
    } catch (parseErr) {
      console.error("Failed to parse query JSON:", parseErr);
      return res.json({ response: "Error parsing query from LLM." });
    }

    const collection = db.collection("logs");
    const results = await collection.find(query).limit(100).toArray();

    res.json({ response: results });
  } catch (err) {
    console.error("Error in /api/chat:", err);
    res.status(500).json({ response: "Internal server error." });
  }
});

// start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
