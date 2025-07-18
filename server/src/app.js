
const express = require('express');
const axios = require('axios');

const app = express();

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));