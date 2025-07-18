function StructuredResponse({ data }) {
  if (!Array.isArray(data) || data.length === 0 || typeof data[0] !== "object") {
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  }

  // Map internal keys to display names
  const fieldMap = {
    transactionSourceName: "Source",
    country_code: "Country",
    status: "Status",
    timestamp: "Timestamp",
    TOTAL_JOBS_IN_FEED: "Jobs in feed",
    TOTAL_JOBS_SENT_TO_INDEX: "Jobs sent",
  };

  // Gather keys from all rows to determine which columns to show
  const allKeys = new Set();
  data.forEach((row) => {
    Object.keys(row).forEach((key) => allKeys.add(key));
    if (row.progress && typeof row.progress === "object") {
      Object.keys(row.progress).forEach((key) => allKeys.add(key));
    }
  });

  // Determine fields to show (only those in fieldMap)
  const fieldsToShow = Object.keys(fieldMap).filter((key) => allKeys.has(key));

  return (
    <table className="structured-response">
      <thead>
        <tr>
          {fieldsToShow.map((key) => (
            <th key={key}>{fieldMap[key]}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIdx) => (
          <tr key={rowIdx}>
            {fieldsToShow.map((key) => {
              // For nested fields inside "progress", access accordingly
              let value;
              if (key === "TOTAL_JOBS_IN_FEED" || key === "TOTAL_JOBS_SENT_TO_INDEX") {
                value = row.progress ? row.progress[key] : "";
              } else {
                value = row[key];
              }

              // Format timestamp nicely
              if (key === "timestamp" && value) {
                value = new Date(value).toLocaleString();
              }

              return <td key={key}>{value ?? ""}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default StructuredResponse;