import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LogsTable from './components/LogsTable';
import DateFilter from './components/DateFilter';

function App() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

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

    useEffect(() => {
    if (!fromDate && !toDate) {
      setFilteredLogs(logs);
      return;
    }

    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const filtered = logs.filter(log => {
      const ts = new Date(log.timestamp);
      return (!from || ts >= from) && (!to || ts <= to);
    });

    setFilteredLogs(filtered);
  }, [fromDate, toDate, logs]);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Job trading logs</h1>
      <DateFilter
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
      />
      <LogsTable logs={filteredLogs} />
    </div>
  );
}

export default App;