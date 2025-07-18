const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://storage.googleapis.com/feeds-json/feeds/transformedFeeds.json"
    );
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching logs:", err.message);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

module.exports = router;