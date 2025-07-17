import { useEffect, useState } from "react";
import axios from "axios";
import LogsTable from "./components/LogsTable/LogsTable";
import Filters from "./components/Filters/Filters";
import "./App.css";

function App() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedClient, setSelectedClient] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");

  const [clientOptions, setClientOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);

  const [sortField, setSortField] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState("decs");

  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 20;

  // fetch logs from the server
  useEffect(() => {
    axios
      .get("/api/logs")
      .then((response) => {
        setLogs(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  // extract client and country options
  useEffect(() => {
    if (!logs || logs.length === 0) return;

    const uniqueClients = [
      ...new Set(logs.map((log) => log.transactionSourceName)),
    ].filter(Boolean);

    const uniqueCountries = [
      ...new Set(logs.map((log) => log.country_code)),
    ].filter(Boolean);

    setClientOptions(["All", ...uniqueClients]);
    setCountryOptions(["All", ...uniqueCountries]);
  }, [logs]);

  // filter logs
  useEffect(() => {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const filtered = logs.filter((log) => {
      const ts = new Date(log.timestamp);
      const matchesDate = (!from || ts >= from) && (!to || ts <= to);
      const matchesClient =
        selectedClient === "All" ||
        !selectedClient ||
        log.transactionSourceName === selectedClient;
      const matchesCountry =
        selectedCountry === "All" ||
        !selectedCountry ||
        log.country_code === selectedCountry;

      return matchesDate && matchesClient && matchesCountry;
    });

    setFilteredLogs(filtered);
    setCurrentPage(1); // reset pagination
  }, [logs, fromDate, toDate, selectedClient, selectedCountry]);

  // sorting
  const sortLogs = (logsToSort) => {
    const sorted = [...logsToSort].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (!valA || !valB) return 0;

      if (sortDirection === "asc") {
        return valA > valB ? 1 : valA < valB ? -1 : 0;
      } else {
        return valA < valB ? 1 : valA > valB ? -1 : 0;
      }
    });

    return sorted;
  };

  const sortedLogs = sortLogs(filteredLogs);
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = sortedLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSortChange = (field) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="app-container">
      <h1>Job Trading Logs</h1>

      <Filters
        dateFilter={{ fromDate, toDate, setFromDate, setToDate }}
        clientFilter={{ clientOptions, selectedClient, setSelectedClient }}
        countryFilter={{ countryOptions, selectedCountry, setSelectedCountry }}
      />

      <LogsTable
        logs={currentLogs}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
