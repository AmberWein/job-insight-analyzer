// const express = require("express");
// const { getDB } = require("../db");
// const { queryClaude } = require("../services/claudeService");
// const { parseClaudeQuery } = require("../utils/parseQuery");

// const router = express.Router();

// router.post("/", async (req, res) => {
//   const { question } = req.body;

//   if (!question) {
//     return res.status(400).json({ error: "Missing question" });
//   }

//   try {
//     const answer = await queryClaude(question);

//     if (!answer || answer === "UNSUPPORTED") {
//       return res.json({ response: "Sorry, I cannot answer that question." });
//     }

//     let query;
//     try {
//       query = parseClaudeQuery(answer);
//     } catch (err) {
//       return res.status(400).json({ response: "Failed to parse query from LLM." });
//     }

//     const db = getDB();
//     const results = await db.collection("logs").find(query).limit(100).toArray();

//     res.json({ response: results });
//   } catch (err) {
//     console.error("Error in /api/chat:", err.message);
//     res.status(500).json({ response: "Internal server error." });
//   }
// });

// module.exports = router;

const express = require("express");
const { getDB } = require("../db");
const { queryClaude } = require("../services/claudeService");

const router = express.Router();

router.post("/", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ response: "Please enter a question." });
  }

  try {
    const answer = await queryClaude(question);

    if (!answer || answer.trim() === "UNSUPPORTED") {
      return res.json({
        response:
          "I'm not sure how to answer that. Try rephrasing the question or being more specific.",
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(answer);
    } catch {
      return res.status(400).json({
        response:
          "I couldn't understand your question well enough to form a query. Please try asking differently.",
      });
    }

    const query = parsed.query || {};
    const sumField = parsed.sum_field;

    const db = getDB();
    const results = await db
      .collection("logs")
      .find(query)
      .limit(100)
      .toArray();

    if (sumField) {
      const total = results.reduce((sum, item) => {
        const value = sumField
          .split(".")
          .reduce((obj, key) => obj?.[key], item);
        return sum + (typeof value === "number" ? value : 0);
      }, 0);

      const fieldLabelMap = {
        "progress.TOTAL_JOBS_SENT_TO_INDEX": "jobs sent",
        "progress.TOTAL_JOBS_IN_FEED": "jobs in the feed",
      };

      const prettyLabel = fieldLabelMap[sumField] || sumField;

      return res.json({
        response: `There were ${total.toLocaleString()} ${prettyLabel} matching your query.`,
      });
    }

    if (results.length === 0) {
      return res.json({ response: "No results found for your query." });
    }

    return res.json({ response: results });
  } catch (err) {
    console.error("Error in /api/chat:", err.message);
    return res.status(500).json({
      response: "Oops! Something went wrong while processing your question.",
    });
  }
});

module.exports = router;
