require('dotenv').config();
const app = require("./app");
const { connectDB } = require("./db");

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});