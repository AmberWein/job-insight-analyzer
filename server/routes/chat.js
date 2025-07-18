const express = require("express");
const { getDB } = require("../db");
const { queryClaude } = require("../services/claudeService");
const { parseClaudeQuery } = require("../utils/parseQuery");

const router = express.Router();

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
      query = parseClaudeQuery(answer);
    } catch (err) {
      return res.status(400).json({ response: "Failed to parse query from LLM." });
    }

    const db = getDB();
    const results = await db.collection("logs").find(query).limit(100).toArray();

    res.json({ response: results });
  } catch (err) {
    console.error("Error in /api/chat:", err.message);
    res.status(500).json({ response: "Internal server error." });
  }
});

module.exports = router;