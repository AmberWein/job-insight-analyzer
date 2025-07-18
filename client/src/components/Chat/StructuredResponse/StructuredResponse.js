function StructuredResponse({ data }) {
  if (!Array.isArray(data) || data.length === 0 || typeof data[0] !== "object") {
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  }

  const headers = Object.keys(data[0]);

  return (
    <table className="structured-response">
      <thead>
        <tr>
          {headers.map((key) => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {headers.map((key) => (
              <td key={key}>{String(row[key])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default StructuredResponse;