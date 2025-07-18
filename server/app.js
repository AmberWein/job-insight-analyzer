const express = require("express");
const app = express();

const logsRouter = require("./routes/log");
const chatRouter = require("./routes/chat");

app.use(express.json());

// set routes
app.use("/api/logs", logsRouter);
app.use("/api/chat", chatRouter);

module.exports = app;