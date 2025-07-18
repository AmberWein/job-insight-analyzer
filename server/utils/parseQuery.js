function parseClaudeQuery(answer) {
  try {
    const cleaned = answer.replace(
      /new Date\(([^)]+)\)/g,
      (_, dateStr) => `"${new Date(dateStr.replace(/['"]/g, "")).toISOString()}"`
    );

    const query = JSON.parse(cleaned);

    if (query.date) {
      if (query.date.$gte && typeof query.date.$gte === "string") {
        query.date.$gte = new Date(query.date.$gte);
      }
      if (query.date.$lt && typeof query.date.$lt === "string") {
        query.date.$lt = new Date(query.date.$lt);
      }
    }

    return query;
  } catch (err) {
    throw new Error("Invalid query format");
  }
}

module.exports = {
  parseClaudeQuery,
};