
import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./components/Dashboard/Dashboard";
import ChatContainer from "./components/Chat/ChatContainer/ChatContainer";
import "./App.css";

function App() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeScreen, setActiveScreen] = useState("dashboard");

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

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Job trading analytics</h1>
        <nav className="app-nav">
          <button
            className={`nav-button ${activeScreen === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveScreen("dashboard")}
          >
            Operations dashboard
          </button>
          <button
            className={`nav-button ${activeScreen === "chat" ? "active" : ""}`}
            onClick={() => setActiveScreen("chat")}
          >
            AI chat assistant
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeScreen === "dashboard" ? (
          <Dashboard logs={logs} />
        ) : (
          <ChatContainer />
        )}
      </main>
    </div>
  );
}

export default App;