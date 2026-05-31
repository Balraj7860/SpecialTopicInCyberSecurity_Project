import { useState } from "react";

const COUNTRIES = ["Canada","United States","Mexico","Colombia","Brazil","Argentina","Spain","United Kingdom","Germany","France","Australia","Other"];

export default function Register({ onLogin, onGoLogin }) {
  const [form, setForm] = useState({ username:"", fullName:"", email:"", dob:"", country:"", zipCode:"", phone:"", password:"", confirm:"" });
  const [message, setMessage] = useState("");
  const [loading, setLoading]  = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (form.password !== form.confirm) { setMessage("Passwords do not match."); return; }
    if (form.password.length < 6)       { setMessage("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const res  = await fetch("http://localhost:5000/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: form.username, password: form.password, fullName: form.fullName, email: form.email, dob: form.dob, country: form.country, zipCode: form.zipCode, phone: form.phone }),
      });
      const data = await res.json();
      if (!res.ok) { setMessage(data.error || "Registration failed."); setLoading(false); return; }
      onLogin(data);
    } catch { setMessage("Could not connect to the server."); setLoading(false); }
  };

  return (
    <>
      <style>{`
        .auth-page  { min-height:100vh;background:#f3f4f6;display:flex;align-items:center;justify-content:center;font-family:'Inter',sans-serif;padding:24px 0; }
        .auth-box   { background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:36px;width:min(480px,92vw);box-shadow:0 1px 4px rgba(0,0,0,0.07); }
        .brand      { display:flex;align-items:center;gap:10px;margin-bottom:24px; }
        .brand-logo { width:34px;height:34px;background:#1d4ed8;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:12px;flex-shrink:0; }
        .brand-name { font-size:14px;font-weight:700;color:#111827; }
        .brand-sub  { font-size:11px;color:#6b7280;margin-top:1px; }
        .auth-title { font-size:20px;font-weight:700;color:#111827;margin-bottom:4px; }
        .auth-sub   { font-size:13px;color:#6b7280;margin-bottom:22px; }
        .err-msg    { background:#fef2f2;border:1px solid #fecaca;color:#dc2626;padding:10px 12px;border-radius:6px;font-size:13px;margin-bottom:14px; }
        .form-grid  { display:grid;grid-template-columns:1fr 1fr;gap:14px; }
        .field      { display:flex;flex-direction:column;gap:5px; }
        .field.full { grid-column:1/-1; }
        .field label{ font-size:12px;font-weight:500;color:#374151; }
        .field input,
        .field select{ padding:9px 12px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;font-family:'Inter',sans-serif;color:#111827;outline:none;background:#fff;transition:border-color 0.15s; }
        .field input:focus,
        .field select:focus{ border-color:#1d4ed8;box-shadow:0 0 0 3px rgba(29,78,216,0.1); }
        .field select option{ background:#fff; }
        .divider    { grid-column:1/-1;border:none;border-top:1px solid #f3f4f6;margin:4px 0; }
        .btn-main   { width:100%;padding:10px;background:#1d4ed8;color:#fff;border:none;border-radius:6px;font-size:14px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;margin-top:16px;transition:background 0.15s; }
        .btn-main:hover{ background:#1e40af; }
        .btn-main:disabled{ opacity:0.6;cursor:not-allowed; }
        .auth-footer{ margin-top:18px;padding-top:14px;border-top:1px solid #f3f4f6;font-size:13px;color:#6b7280;text-align:center; }
        .auth-footer button{ background:none;border:none;color:#1d4ed8;font-size:13px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif; }
        .auth-footer button:hover{ text-decoration:underline; }
        .section-label{ grid-column:1/-1;font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;margin-top:4px; }
        @media(max-width:500px){ .form-grid{ grid-template-columns:1fr; } .field.full{ grid-column:1; } }
      `}</style>

      <div className="auth-page">
        <div className="auth-box">
          <div className="brand">
            <div className="brand-logo">DBI</div>
            <div><div className="brand-name">DBI Wallet</div><div className="brand-sub">Secure Digital Wallet</div></div>
          </div>
          <h1 className="auth-title">Create an account</h1>
          <p className="auth-sub">Fill in your details to get started</p>
          {message && <div className="err-msg">{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-grid">

              <div className="section-label">Account</div>
              <div className="field">
                <label>Username *</label>
                <input type="text" placeholder="jdoe" value={form.username} onChange={set("username")} required />
              </div>
              <div className="field">
                <label>Email *</label>
                <input type="email" placeholder="you@email.com" value={form.email} onChange={set("email")} required />
              </div>
              <div className="field">
                <label>Password *</label>
                <input type="password" placeholder="Min. 6 characters" value={form.password} onChange={set("password")} required />
              </div>
              <div className="field">
                <label>Confirm Password *</label>
                <input type="password" placeholder="Repeat password" value={form.confirm} onChange={set("confirm")} required />
              </div>

              <hr className="divider" />
              <div className="section-label">Personal Information</div>

              <div className="field full">
                <label>Full Name *</label>
                <input type="text" placeholder="John Doe" value={form.fullName} onChange={set("fullName")} required />
              </div>
              <div className="field">
                <label>Date of Birth</label>
                <input type="date" value={form.dob} onChange={set("dob")} />
              </div>
              <div className="field">
                <label>Country of Residence</label>
                <select value={form.country} onChange={set("country")}>
                  <option value="">Select country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Zip / Postal Code</label>
                <input type="text" placeholder="A1A 1A1" value={form.zipCode} onChange={set("zipCode")} />
              </div>
              <div className="field">
                <label>Phone Number</label>
                <input type="tel" placeholder="+1 555 000 0000" value={form.phone} onChange={set("phone")} />
              </div>

            </div>
            <button className="btn-main" type="submit" disabled={loading}>{loading ? "Creating account..." : "Create Account"}</button>
          </form>
          <div className="auth-footer">
            Already have an account? <button onClick={onGoLogin}>Sign in</button>
          </div>
        </div>
      </div>
    </>
  );
}