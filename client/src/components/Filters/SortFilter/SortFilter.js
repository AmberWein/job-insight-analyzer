import React from 'react';

const SortFilter = ({ sortField, setSortField, sortDirection, setSortDirection }) => {
  return (
    <div>
      <label>
        Sort by:&nbsp;
        <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
          <option value="timestamp">Date</option>
          <option value="client">Client</option>
          <option value="country">Country</option>
        </select>
      </label>

      <label>
        Direction:&nbsp;
        <select value={sortDirection} onChange={(e) => setSortDirection(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </label>
    </div>
  );
};

export default SortFilter;