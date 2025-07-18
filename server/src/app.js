const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

app.get('/api/logs', async (req, res) => {
  try {
    const response = await axios.get('https://storage.googleapis.com/feeds-json/feeds/transformedFeeds.json');
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error('Error fetching remote data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.post('/api/chat', async (req, res) => {
  const { question } = req.body;
  // TODO: parse the question, run a query in Mongo, and return a result
  res.json({ response: "Received your question: " + question });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
