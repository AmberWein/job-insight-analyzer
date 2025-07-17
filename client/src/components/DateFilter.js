import React from "react";

function DataFilter({fromData, toDate, setFromDate, setToDate}) {
  return (
    <div>
      <label>
        From:{' '}
        <input
          type="date"
          value={fromData}
          onChange={(e) => setFromDate(e.target.value)}
        />
      </label>
      {' '}
      <label>
        To:{' '}
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </label>
    </div>
  );
}

export default DataFilter;