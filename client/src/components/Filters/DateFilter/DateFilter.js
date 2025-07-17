import './DateFilter.css';

function DateFilter({ fromDate, toDate, setFromDate, setToDate }) {
  return (
    <>
      <div>
        <label>From:</label>
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
      </div>
      <div>
        <label>To:</label>
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
      </div>
    </>
  );
}

export default DateFilter;