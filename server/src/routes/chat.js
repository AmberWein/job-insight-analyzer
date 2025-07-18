import express from "express";
import fetch from "node-fetch";

const router = express.Router();

async function queryClaude(question) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "anthropic/claude-2",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant answering questions about job logs from a MongoDB database."
        },
        {
          role: "user",
          content: question
        }
      ]
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response from Claude";
}

// POST /api/chat
router.post("/", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Missing question in request body" });
  }

  try {
    const answer = await queryClaude(question);
    res.json({ response: answer });
  } catch (err) {
    console.error("Error querying Claude:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;