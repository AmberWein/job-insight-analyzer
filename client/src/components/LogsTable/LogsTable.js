import './LogsTable.css';

function LogsTable({ logs, sortField, sortDirection, onSortChange }) {
  // render sort arrow based on current sort field and direction
  const renderSortArrow = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' 🔼' : ' 🔽';
  };

  return (
    <table border="1" cellPadding="5" cellSpacing="0">
      <thead>
        <tr>
          <th></th>
          <th onClick={() => onSortChange('transactionSourceName')} style={{ cursor: 'pointer' }}>
            Source{renderSortArrow('transactionSourceName')}
          </th>
          <th onClick={() => onSortChange('country_code')} style={{ cursor: 'pointer' }}>
            Country{renderSortArrow('country_code')}
          </th>
          <th>Status</th>
          <th onClick={() => onSortChange('timestamp')} style={{ cursor: 'pointer' }}>
            Timestamp{renderSortArrow('timestamp')}
          </th>
          <th>Jobs in feed</th>
          <th>Jobs sent</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log, index) => (
          <tr key={log._id}>
            <td>{index + 1}</td>
            <td>{log.transactionSourceName}</td>
            <td>{log.country_code}</td>
            <td>{log.status}</td>
            <td>{new Date(log.timestamp).toLocaleString()}</td>
            <td>{log.progress?.TOTAL_JOBS_IN_FEED?.toLocaleString()}</td>
            <td>{log.progress?.TOTAL_JOBS_SENT_TO_INDEX?.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LogsTable;