import { useEffect, useState } from "react";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Admin from "./Pages/Admin";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("login");
  const [authChecked, setAuthChecked] = useState(false);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setPage(user.role === "admin" ? "admin" : "dashboard");
  };

  const handleLogout = async () => {
    try { await fetch("http://localhost:5001/logout", { method: "POST", credentials: "include" }); } catch {}
    setCurrentUser(null);
    setPage("login");
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await fetch("http://localhost:5001/me", { credentials: "include" });
        if (res.ok) {
          handleLogin(await res.json());
        }
      } catch {
        // Stay on the login page when there is no active backend session.
      } finally {
        setAuthChecked(true);
      }
    };

    restoreSession();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #f3f4f6; }

        .navbar {
          background: #fff;
          border-bottom: 1px solid #e5e7eb;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-brand { display: flex; align-items: center; gap: 10px; }

        .nav-logo {
          width: 32px; height: 32px;
          background: #1d4ed8;
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: 700; font-size: 12px;
        }

        .nav-name { font-size: 14px; font-weight: 700; color: #111827; }
        .nav-sub  { font-size: 11px; color: #6b7280; }

        .nav-right { display: flex; align-items: center; gap: 6px; }

        .nav-user {
          font-size: 12px; color: #6b7280;
          padding-right: 12px;
          border-right: 1px solid #e5e7eb;
          margin-right: 4px;
        }

        .nav-btn {
          padding: 6px 14px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background: #fff;
          color: #374151;
          font-size: 13px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .nav-btn:hover { background: #f9fafb; border-color: #d1d5db; }
        .nav-btn.active { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; font-weight: 600; }
        .nav-btn.logout { color: #dc2626; border-color: #fecaca; }
        .nav-btn.logout:hover { background: #fef2f2; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
        {currentUser && (
          <nav className="navbar">
            <div className="nav-brand">
              <div className="nav-logo">DBI</div>
              <div>
                <div className="nav-name">DBI Wallet</div>
                <div className="nav-sub">Secure Digital Wallet</div>
              </div>
            </div>
            <div className="nav-right">
              <span className="nav-user">{currentUser.fullName || currentUser.username} · {currentUser.role}</span>
              {currentUser.role !== "admin" && (
                <button className={`nav-btn ${page === "dashboard" ? "active" : ""}`} onClick={() => setPage("dashboard")}>
                  Dashboard
                </button>
              )}
              {currentUser.role === "admin" && (
                <button className={`nav-btn ${page === "admin" ? "active" : ""}`} onClick={() => setPage("admin")}>
                  Admin Panel
                </button>
              )}
              <button className="nav-btn logout" onClick={handleLogout}>Sign Out</button>
            </div>
          </nav>
        )}

        <main>
          {!authChecked && !currentUser && null}
          {authChecked && !currentUser && page === "login"    && <Login    onLogin={handleLogin} onGoRegister={() => setPage("register")} />}
          {authChecked && !currentUser && page === "register" && <Register onLogin={handleLogin} onGoLogin={() => setPage("login")} />}
          {currentUser  && page === "dashboard" && <Dashboard user={currentUser} />}
          {currentUser  && page === "admin"     && currentUser.role === "admin" && <Admin />}
        </main>
      </div>
    </>
  );
}
