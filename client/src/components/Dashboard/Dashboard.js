import { useEffect, useMemo, useState } from "react";
import LogsChart from "../LogsChart/LogsChart";
import LogsTable from "../LogsTable/LogsTable";
import Filters from "../Filters/Filters";

function Dashboard({ logs }) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedClient, setSelectedClient] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");

  const [sortField, setSortField] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 20;

  // extract filter options
  const clientOptions = useMemo(() => {
    const unique = [...new Set(logs.map((l) => l.transactionSourceName))].filter(Boolean);
    return ["All", ...unique];
  }, [logs]);

  const countryOptions = useMemo(() => {
    const unique = [...new Set(logs.map((l) => l.country_code))].filter(Boolean);
    return ["All", ...unique];
  }, [logs]);

  // filter logs
  const filteredLogs = useMemo(() => {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    return logs.filter((log) => {
      const ts = new Date(log.timestamp);
      const matchesDate = (!from || ts >= from) && (!to || ts <= to);
      const matchesClient = selectedClient === "All" || log.transactionSourceName === selectedClient;
      const matchesCountry = selectedCountry === "All" || log.country_code === selectedCountry;
      return matchesDate && matchesClient && matchesCountry;
    });
  }, [logs, fromDate, toDate, selectedClient, selectedCountry]);

  // sort logs
  const sortedLogs = useMemo(() => {
    return [...filteredLogs].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (!valA || !valB) return 0;

      return sortDirection === "asc"
        ? valA > valB ? 1 : valA < valB ? -1 : 0
        : valA < valB ? 1 : valA > valB ? -1 : 0;
    });
  }, [filteredLogs, sortField, sortDirection]);

  // pagination
  const totalPages = Math.ceil(sortedLogs.length / logsPerPage);
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = sortedLogs.slice(indexOfFirstLog, indexOfLastLog);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSortChange = (field) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // reset to page 1 on filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [fromDate, toDate, selectedClient, selectedCountry]);

  return (
    <div className="dashboard-container">
      <Filters
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        clientOptions={clientOptions}
        countryOptions={countryOptions}
      />

      <LogsChart logs={filteredLogs} />

      <LogsTable
        logs={currentLogs}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {/* pagination */}
      <div className="pagination-controls">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          &lt; Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next &gt;
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
