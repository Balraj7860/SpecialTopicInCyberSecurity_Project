import { useEffect, useState } from "react";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Admin from "./Pages/Admin";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("login");

  useEffect(() => {
    window.location.hash = page;
  }, [page]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setPage(user.role === "admin" ? "admin" : "dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0b", color: "#fff" }}>
      {currentUser && (
        <header style={{ padding: 16, borderBottom: "1px solid #444", display: "flex", gap: 12, background: "#111" }}>
          <button onClick={() => setPage("dashboard")} style={buttonStyle}>
            Dashboard
          </button>
          {currentUser.role === "admin" && (
            <button onClick={() => setPage("admin")} style={buttonStyle}>
              Admin
            </button>
          )}
          <button onClick={handleLogout} style={buttonStyle}>
            Logout
          </button>
        </header>
      )}

      <main>
        {!currentUser && <Login onLogin={handleLogin} />}
        {currentUser && page === "dashboard" && <Dashboard user={currentUser} />}
        {currentUser && page === "admin" && currentUser.role === "admin" && <Admin />}
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
