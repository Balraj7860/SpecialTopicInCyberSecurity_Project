import { useState } from "react";

export default function Login({ onLogin, onGoRegister }) {
  const [form, setForm]       = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); setLoading(true);
    try {
      const res  = await fetch("http://localhost:5000/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setMessage(data.error || "Login failed."); setLoading(false); return; }
      onLogin(data);
    } catch { setMessage("Could not connect to the server. Make sure the backend is running on port 5000."); setLoading(false); }
  };

  return (
    <>
      <style>{`
        .auth-page { min-height:100vh; background:#f3f4f6; display:flex; align-items:center; justify-content:center; font-family:'Inter',sans-serif; }
        .auth-box  { background:#fff; border:1px solid #e5e7eb; border-radius:8px; padding:40px 36px; width:min(400px,92vw); box-shadow:0 1px 4px rgba(0,0,0,0.07); }
        .brand     { display:flex; align-items:center; gap:10px; margin-bottom:28px; }
        .brand-logo{ width:36px;height:36px;background:#1d4ed8;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:13px;flex-shrink:0; }
        .brand-name{ font-size:15px;font-weight:700;color:#111827; }
        .brand-sub { font-size:11px;color:#6b7280;margin-top:1px; }
        .auth-title{ font-size:22px;font-weight:700;color:#111827;margin-bottom:4px; }
        .auth-sub  { font-size:13px;color:#6b7280;margin-bottom:24px; }
        .err-msg   { background:#fef2f2;border:1px solid #fecaca;color:#dc2626;padding:10px 12px;border-radius:6px;font-size:13px;margin-bottom:16px; }
        .field     { margin-bottom:16px; }
        .field label{ display:block;font-size:13px;font-weight:500;color:#374151;margin-bottom:6px; }
        .field input{ width:100%;padding:9px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:14px;font-family:'Inter',sans-serif;color:#111827;outline:none;background:#fff;transition:border-color 0.15s,box-shadow 0.15s; }
        .field input:focus{ border-color:#1d4ed8;box-shadow:0 0 0 3px rgba(29,78,216,0.1); }
        .btn-main  { width:100%;padding:10px;background:#1d4ed8;color:#fff;border:none;border-radius:6px;font-size:14px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;margin-top:4px;transition:background 0.15s; }
        .btn-main:hover{ background:#1e40af; }
        .btn-main:disabled{ opacity:0.6;cursor:not-allowed; }
        .auth-footer{ margin-top:20px;padding-top:16px;border-top:1px solid #f3f4f6;font-size:13px;color:#6b7280;text-align:center; }
        .auth-footer button{ background:none;border:none;color:#1d4ed8;font-size:13px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif; }
        .auth-footer button:hover{ text-decoration:underline; }
      `}</style>

      <div className="auth-page">
        <div className="auth-box">
          <div className="brand">
            <div className="brand-logo">DBI</div>
            <div><div className="brand-name">DBI Wallet</div><div className="brand-sub">Secure Digital Wallet</div></div>
          </div>
          <h1 className="auth-title">Sign in</h1>
          <p className="auth-sub">Welcome back — enter your credentials to continue</p>
          {message && <div className="err-msg">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Username</label>
              <input type="text" placeholder="Enter your username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} autoComplete="username" />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} autoComplete="current-password" />
            </div>
            <button className="btn-main" type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
          </form>
          <div className="auth-footer">
            Don't have an account? <button onClick={onGoRegister}>Create one</button>
          </div>
        </div>
      </div>
    </>
  );
}