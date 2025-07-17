import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LogsTable from './components/LogsTable';

function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/logs')
      .then(response => {
        setLogs(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load data');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Job trading logs</h1>
      <LogsTable logs={logs} />
    </div>
  );
}

export default App;