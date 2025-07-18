const express = require("express");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const { getDB } = require("../db");

const router = express.Router();

async function queryClaude(question) {
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

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
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
  });

  if (!response.ok) {
    throw new Error("OpenRouter API error");
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim();
}

router.post("/", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Missing question" });
  }

  try {
    const answer = await queryClaude(question);

    if (!answer || answer === "UNSUPPORTED") {
      return res.json({ response: "Sorry, I cannot answer that question." });
    }

    let query;
    try {
      // convert the answer to a valid JSON object
      const cleaned = answer.replace(
        /new Date\(([^)]+)\)/g,
        (_, dateStr) =>
          `"${new Date(dateStr.replace(/['"]/g, "")).toISOString()}"`
      );

      query = JSON.parse(cleaned);

      // special handling for date fields
      if (query.date) {
        if (query.date.$gte && typeof query.date.$gte === "string") {
          query.date.$gte = new Date(query.date.$gte);
        }
        if (query.date.$lt && typeof query.date.$lt === "string") {
          query.date.$lt = new Date(query.date.$lt);
        }
      }
    } catch (err) {
      console.error("Failed to parse query JSON:", err);
      return res.json({ response: "Error parsing query from LLM." });
    }

    const db = getDB();
    const results = await db.collection("logs").find(query).limit(100).toArray();

    res.json({ response: results });
  } catch (err) {
    console.error("Error in /api/chat:", err);
    res.status(500).json({ response: "Internal server error." });
  }
});

module.exports = router;