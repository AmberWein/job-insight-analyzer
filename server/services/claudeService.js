const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function queryClaude(question) {
  const prompt = `
You are an assistant that translates natural language questions about job logs into MongoDB queries.
Return only the MongoDB query object (as valid JSON) that can be used with collection.find().
Do not include JavaScript code such as new Date(). Instead, provide ISO string format.

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
    throw new Error("Claude API error");
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim();
}

module.exports = {
  queryClaude,
};