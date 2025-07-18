
import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./components/Dashboard/Dashboard";
import ChatContainer from "./components/Chat/ChatContainer/ChatContainer";
import "./App.css";

function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    // <div className="app-container">
    //   <h1>Job Trading Logs</h1>
    //   <Dashboard logs={logs} />
    // </div>
    <div className="app-container">
      <h1>AI Chat Assistant</h1>
      <ChatContainer />
    </div>
  );
}

export default App;