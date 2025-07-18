const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function queryClaude(question) {
  const todayISO = new Date().toISOString().substring(0, 10);
  const todayStart = todayISO + "T00:00:00.000Z";
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const tomorrowISO =
    tomorrow.toISOString().substring(0, 10) + "T00:00:00.000Z";

  const prompt = `
You are an assistant that translates natural language questions about job logs into MongoDB queries.

Return ONLY the MongoDB query object as valid JSON for collection.find().

Do NOT include any JavaScript code such as new Date().

Interpret friendly date terms like "last week", "last month", "today", "yesterday" into exact ISO date ranges relative to the current date.

The current date is ${todayISO}.

Example:
Question: "Show me logs from the last week."
Answer:
{
  "timestamp": {
    "$gte": "${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()}",
    "$lt": "${todayStart}"
  }
}

Question: "${question}"
`;

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
    throw new Error("Claude API error");
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim();
}

module.exports = {
  queryClaude,
};
