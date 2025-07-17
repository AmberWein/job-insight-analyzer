// import React from "react";
import './LogsTable.css';

function LogsTable({ logs }) {
  return (
    <table border="1" cellPadding="5" cellSpacing="0">
      <thead>
        <tr>
          <th></th>
          <th>Source</th>
          <th>Country</th>
          <th>Status</th>
          <th>Timestamp</th>
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
            <td>{log.progress?.TOTAL_JOBS_IN_FEED.toLocaleString()}</td>
            <td>{log.progress?.TOTAL_JOBS_SENT_TO_INDEX.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default LogsTable;
