import { useEffect, useState } from "react";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Admin from "./Pages/Admin";

function App() {
  const [page, setPage] = useState(() => window.location.hash.slice(1) || "login");

  useEffect(() => {
    window.location.hash = page;
  }, [page]);

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0b", color: "#fff" }}>
      <header style={{ padding: 16, borderBottom: "1px solid #444", display: "flex", gap: 12, background: "#111" }}>
        <button onClick={() => setPage("login")} style={buttonStyle}>
          Login
        </button>
        <button onClick={() => setPage("dashboard")} style={buttonStyle}>
          Dashboard
        </button>
        <button onClick={() => setPage("admin")} style={buttonStyle}>
          Admin
        </button>
      </header>

      <main>
        {page === "login" && <Login />}
        {page === "dashboard" && <Dashboard />}
        {page === "admin" && <Admin />}
      </main>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 16px",
  border: "1px solid #d4af37",
  background: "transparent",
  color: "#d4af37",
  cursor: "pointer",
};

export default App;
