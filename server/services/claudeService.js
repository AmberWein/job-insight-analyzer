const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function queryClaude(question) {
  const prompt = `
You are a friendly and helpful assistant who translates natural language questions about job logs into MongoDB queries.

Return ONLY the MongoDB query object as valid JSON usable with collection.find().

Do NOT include any JavaScript code such as new Date(); use ISO string format for dates instead.

Interpret friendly time terms such as:
- "last week" means the previous 7 days from today,
- "last month" means the previous calendar month,
- "today" means the current day,
- "yesterday" means the previous day,
and convert them into appropriate ISO date ranges in the query.

If you cannot generate a valid query, respond only with "UNSUPPORTED".

Example:
Question: "Show me all logs from US in the last week."
Answer: {
  "country_code": "US",
  "timestamp": { "$gte": "2025-07-11T00:00:00.000Z", "$lt": "2025-07-18T00:00:00.000Z" }
}

Now, process this question:
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
    throw new Error("Claude API error");
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim();
}

module.exports = {
  queryClaude,
};