const { get } = require("../app");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

function getISORanges() {
  const now = new Date();
  const nowISO = now.toISOString();
  
  // start of today (00:00:00)
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).toISOString();

  // strart of the week (Sunday)
  const dayOfWeek = now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek);
  const thisWeekStart = new Date(
    weekStart.getFullYear(),
    weekStart.getMonth(),
    weekStart.getDate()
  ).toISOString();

  // start of the month
  const thisMonthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).toISOString();

  // last month - full month range
  const lastMonthStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEndDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = lastMonthStartDate.toISOString();
  const lastMonthEnd = lastMonthEndDate.toISOString();

  // last week - 7 days before today
  const lastWeekStartDate = new Date(now);
  lastWeekStartDate.setDate(now.getDate() - 7);
  const lastWeekStart = lastWeekStartDate.toISOString();

  return {
    todayStart,
    thisWeekStart,
    thisMonthStart,
    lastMonthStart,
    lastMonthEnd,
    lastWeekStart,
    nowISO,
  };
}

async function queryClaude(question) {
  const {
    todayStart,
    thisWeekStart,
    thisMonthStart,
    lastMonthStart,
    lastMonthEnd,
    lastWeekStart,
    nowISO,
  } = getISORanges();

  const prompt = `
You are an assistant that translates natural language questions about job logs into MongoDB queries.

Return ONLY the MongoDB query object as valid JSON suitable for collection.find().

- Do NOT include any JavaScript code, functions, or variables such as new Date().
- Use ISO date string format (e.g. "2025-07-18T00:00:00.000Z") for any dates.
- Interpret friendly date terms into exact ISO date ranges relative to the current date (${nowISO}):

  - "today" means from the start of the current day (${todayStart}) until now.
  - "yesterday" means the entire day before today.
  - "last week" means the 7 full days before today (not including today), starting at ${lastWeekStart}.
  - "this week" means from Sunday of the current week (${thisWeekStart}) until now.
  - "last month" means the full previous calendar month from ${lastMonthStart} to ${lastMonthEnd}.
  - "this month" means from the first day of the current month (${thisMonthStart}) until now.

- Translate common user terms into field names:

  - "source" or "transaction source" → "transactionSourceName"
  - "country" → "country_code"
  - "status" → "status"
  - "jobs in feed" → "progress.TOTAL_JOBS_IN_FEED"
  - "jobs sent" → "progress.TOTAL_JOBS_SENT_TO_INDEX"
  - "timestamp" → "timestamp"

- Support simple logical operations: AND, OR.
- If you cannot translate the question into a MongoDB query, respond with exactly: "UNSUPPORTED".

Examples:

Question: "Show me logs from the last week."
Answer:
{
  "timestamp": {
    "$gte": "${lastWeekStart}",
    "$lt": "${todayStart}"
  }
}

Question: "Show completed logs from the US from last month."
Answer:
{
  "status": "completed",
  "country_code": "US",
  "timestamp": {
    "$gte": "${lastMonthStart}",
    "$lt": "${lastMonthEnd}"
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
