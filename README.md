# Job Analytics Dashboard & AI Chat Assistant
This project is a full-stack application for visualizing job log data and interacting with it using natural language via an AI assistant.
<br>
## Features
### Screen A – Operations Dashboard
- Interactive dashboard with line charts and a sortable, filterable table.
- Filters by date, client, and country.
- Highlights key metrics like average logs and day-over-day delta.
- Pagination and sorting for efficient data navigation.

### Screen B – AI Chat Assistant
- Chat interface to ask natural-language questions like:
  - "How many jobs are from the Us or the GB?"
- Uses a Large Language Model (Claude 3) to translate user questions into MongoDB queries.
- Results are displayed directly in the chat.

## Technologies

- **Frontend**: React
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **AI Service**: Claude 3 via OpenRouter

## Prerequisites
- Node.js
- MongoDB

## Setup Instructions
### 1. Clone the repository
### 2. Create a .env file in the root with:
<br>MONGO_URI=your_mongo_connection_string
<br>OPENROUTER_API_KEY=your_openrouter_api_key
### 3. Load log data into MongoDB
<br> Run the following command once to populate your database with sample data:
<br> node .\server\uploadLogs.js
### 3. Install dependencies: 
<br> In the root folder: npm install
<br> And for the backend as well:
<br> cd server
<br> npm install
### 4. Run the application:
<br> Start backend:
<br> cd server
<br> node index.js
<br>Start frontend: npm start

## API Endpoints
- GET /api/logs – fetches the log data
- POST /api/chat – sends a natural language question and returns query results or error messages

## Sample Questions for AI
- Show all logs from last week for client Deal1.
- What is the average jobs sent per country last month?

## Prompt Engineering
See PROCESS.md for details about the AI prompt and design process.
