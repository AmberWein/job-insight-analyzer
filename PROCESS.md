Build a menu web app for job log analytics:
1. An operations dashboard.
2. An AI-powered chat assistant that interprets natural-language questions and queries MongoDB.

---

## Architecture

### Frontend

- Built with **React**
- Main components:
  - `Dashboard.js`: renders filters, sorting, chart, and logs table.
  - `ChatContainer.js`: handles chat flow, state, and sending requests.
  - `LogsChart.js`, `LogsTable.js`: present log data.
  - `ChatBox`, `ChatInput`: UI for the AI assistant.

### Backend

- Built with **Node.js + Express**
- Key files:
  - `server/routes/log.js`: fetches logs from external source or MongoDB.
  - `server/routes/chat.js`: handles POST requests to the AI assistant.
  - `claudeService.js`: communicates with Claude 3 via OpenRouter.
  - `parseClaudeQuery.js`: parses and validates AI responses into MongoDB query format.

---

## AI Prompt & Design

### Prompt

The following is sent to Claude 3 when a user asks a question:

You are an assistant that translates natural language questions about job logs into MongoDB queries.
Return only the MongoDB query object (as valid JSON) that can be used with collection.find().
Do not include JavaScript code such as new Date(). Instead, provide ISO string format.

If you cannot generate a query, reply: "UNSUPPORTED".

Question: "${question}"

### Iterations & Reasoning

- Initially Claude returned responses like `db.collection.find(...)` or `new Date(...)`, so I explicitly prohibited those.
- Required ISO date format so parsing is safe server-side.
- Added `"UNSUPPORTED"` fallback to let the frontend gracefully handle ambiguous queries.

---

### How I used AI tools during the task
- In the application, I integrated the Claude 3 Haiku model via the OpenRouter API to power the AI chat assistant. The assistant interprets natural-language questions and returns MongoDB queries, which are executed and returned to the user as structured results. I carefully designed the prompt and query parser to ensure safe and reliable behavior, including fallback handling for unsupported or ambiguous inputs.

- During development, I used AI (ChatGPT) as a support tool to brainstorm ideas, structure components, optimize filtering and pagination logic, and improve prompt engineering.