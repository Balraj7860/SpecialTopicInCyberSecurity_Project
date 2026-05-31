import { useEffect, useState } from "react";

export default function Admin() {
  const [users, setUsers]   = useState([]);
  const [tab, setTab]       = useState("users");
  const [msg, setMsg]       = useState({ text:"", type:"" });
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [addForm, setAddForm]   = useState({ username:"", fullName:"", email:"", dob:"", country:"", zipCode:"", phone:"", password:"", role:"user" });

  const ok  = (t) => setMsg({ text:t, type:"success" });
  const err = (t) => setMsg({ text:t, type:"error"   });

  const COUNTRIES = ["Canada","United States","Mexico","Colombia","Brazil","Argentina","Spain","United Kingdom","Germany","France","Australia","Other"];

  const loadUsers = async () => {
    try {
      const r = await fetch("http://localhost:5000/admin/users", { credentials:"include" });
      if (r.ok) {
        setUsers(await r.json());
      } else {
        const d = await r.json();
        err(d.error);
      }
    } catch { err("Could not connect to backend."); }
  };

  useEffect(() => { loadUsers(); }, []);

  const deleteUser = async (username) => {
    if (!window.confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    try {
      const r = await fetch("http://localhost:5000/admin/users/delete", {
        method:"DELETE", headers:{"Content-Type":"application/json"},
        credentials:"include", body:JSON.stringify({ username })
      });
      const d = await r.json();
      if (r.ok) { ok(d.message); loadUsers(); }
      else { err(d.error); }
    } catch { err("Could not connect."); }
  };

  const addUser = async (e) => {
    e.preventDefault();
    setMsg({ text:"", type:"" });
    try {
      const r = await fetch("http://localhost:5000/admin/users/add", {
        method:"POST", headers:{"Content-Type":"application/json"},
        credentials:"include", body:JSON.stringify(addForm)
      });
      const d = await r.json();
      if (r.ok) {
        ok(d.message);
        setAddForm({ username:"", fullName:"", email:"", dob:"", country:"", zipCode:"", phone:"", password:"", role:"user" });
        loadUsers();
        setTab("users");
      } else {
        err(d.error);
      }
    } catch { err("Could not connect."); }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setMsg({ text:"", type:"" });
    try {
      const r = await fetch("http://localhost:5000/admin/users/edit", {
        method:"PUT", headers:{"Content-Type":"application/json"},
        credentials:"include", body:JSON.stringify({ username: editUser.username, ...editForm })
      });
      const d = await r.json();
      if (r.ok) { ok(d.message); setEditUser(null); loadUsers(); }
      else { err(d.error); }
    } catch { err("Could not connect."); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .admin  { min-height:calc(100vh - 56px);background:#f3f4f6;font-family:'Inter',sans-serif;padding:28px 32px; }
        .ph     { display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:22px;flex-wrap:wrap;gap:12px; }
        .ph h2  { font-size:22px;font-weight:700;color:#111827;margin-bottom:2px; }
        .ph p   { font-size:13px;color:#6b7280; }
        .btn-p  { padding:8px 18px;background:#1d4ed8;color:#fff;border:none;border-radius:6px;font-size:13px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;transition:background 0.15s;white-space:nowrap; }
        .btn-p:hover{ background:#1e40af; }
        .stats  { display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:14px;margin-bottom:18px; }
        .stat   { background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:16px 18px; }
        .sl     { font-size:12px;color:#6b7280;font-weight:500;margin-bottom:6px; }
        .sv     { font-size:22px;font-weight:700;color:#111827; }
        .msg-box{ padding:9px 12px;border-radius:6px;font-size:13px;margin-bottom:16px; }
        .msg-box.success{ background:#f0fdf4;border:1px solid #bbf7d0;color:#16a34a; }
        .msg-box.error  { background:#fef2f2;border:1px solid #fecaca;color:#dc2626; }
        .tabs   { display:flex;border-bottom:2px solid #e5e7eb;margin-bottom:22px; }
        .tab    { background:none;border:none;border-bottom:2px solid transparent;margin-bottom:-2px;padding:9px 16px;font-size:13px;font-weight:500;color:#6b7280;cursor:pointer;font-family:'Inter',sans-serif;transition:color 0.15s; }
        .tab:hover{ color:#374151; }
        .tab.active{ color:#1d4ed8;border-bottom-color:#1d4ed8;font-weight:600; }
        .card-c { background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:20px 22px;margin-bottom:16px; }
        .ct     { font-size:14px;font-weight:600;color:#111827;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid #f3f4f6; }
        table   { width:100%;border-collapse:collapse;table-layout:fixed; }
        thead th{ font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;text-align:left;padding:8px 10px;border-bottom:1px solid #e5e7eb; }
        tbody td{ font-size:13px;color:#374151;padding:10px;border-bottom:1px solid #f9fafb;vertical-align:middle;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
        tbody tr{ height:44px; }
        tbody tr:last-child td{ border-bottom:none; }
        tbody tr:hover td{ background:#fafafa; }
        tbody td input{ background:transparent!important; }
        tbody td:-webkit-autofill{ background:#fff!important; }
        th:nth-child(1),td:nth-child(1){ width:14%; }
        th:nth-child(2),td:nth-child(2){ width:20%; }
        th:nth-child(3),td:nth-child(3){ width:22%; }
        th:nth-child(4),td:nth-child(4){ width:14%; }
        th:nth-child(5),td:nth-child(5){ width:10%; }
        th:nth-child(6),td:nth-child(6){ width:20%; }
        .role-b { display:inline-block;font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;text-transform:uppercase;letter-spacing:0.5px;line-height:1.4;vertical-align:middle; }
        .role-b.admin{ background:#fef3c7;color:#d97706; }
        .role-b.user { background:#eff6ff;color:#1d4ed8; }
        .btn-red{ padding:4px 10px;border:1px solid #fecaca;background:#fef2f2;color:#dc2626;border-radius:5px;font-size:12px;font-weight:500;cursor:pointer;font-family:'Inter',sans-serif; }
        .btn-red:hover{ background:#fee2e2; }
        .btn-edit{ padding:4px 10px;border:1px solid #d1d5db;background:#f9fafb;color:#374151;border-radius:5px;font-size:12px;font-weight:500;cursor:pointer;font-family:'Inter',sans-serif;margin-right:4px; }
        .btn-edit:hover{ background:#f3f4f6; }
        .add-form{ display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px; }
        .fg     { display:flex;flex-direction:column;gap:5px; }
        .fg label{ font-size:12px;font-weight:500;color:#374151; }
        .fg input,.fg select{ padding:8px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;font-family:'Inter',sans-serif;color:#111827;outline:none;background:#fff; }
        .fg input:focus,.fg select:focus{ border-color:#1d4ed8;box-shadow:0 0 0 2px rgba(29,78,216,0.1); }
        .fg.full{ grid-column:1/-1; }
        .form-row{ grid-column:1/-1;display:flex;gap:8px;padding-top:4px; }
        .btn-ghost{ padding:8px 14px;background:#f9fafb;color:#374151;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;font-weight:500;font-family:'Inter',sans-serif;cursor:pointer; }
        .btn-ghost:hover{ background:#f3f4f6; }
        .empty  { text-align:center;padding:28px;color:#9ca3af;font-size:13px; }
        .modal-bg{ position:fixed;inset:0;background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;z-index:200;padding:16px; }
        .modal  { background:#fff;border-radius:8px;padding:28px;width:min(480px,100%);box-shadow:0 8px 32px rgba(0,0,0,0.15); }
        .modal h3{ font-size:16px;font-weight:700;color:#111827;margin-bottom:18px; }
        @media(max-width:600px){ .admin{padding:16px;} }
      `}</style>

      <div className="admin">
        <div className="ph">
          <div><h2>Admin Panel</h2><p>DBI Wallet · User Management</p></div>
          <button className="btn-p" onClick={() => { setTab("add user"); setMsg({ text:"", type:"" }); }}>+ Add User</button>
        </div>

        <div className="stats">
          <div className="stat"><div className="sl">Total Users</div><div className="sv">{users.length}</div></div>
          <div className="stat"><div className="sl">Admins</div><div className="sv">{users.filter(u => u.role === "admin").length}</div></div>
          <div className="stat"><div className="sl">Regular Users</div><div className="sv">{users.filter(u => u.role === "user").length}</div></div>
        </div>

        {msg.text && <div className={`msg-box ${msg.type}`}>{msg.text}</div>}

        <div className="tabs">
          {["users","add user"].map(t => (
            <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => { setTab(t); setMsg({ text:"", type:"" }); }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "users" && (
          <div className="card-c">
            <div className="ct">Registered Users</div>
            {users.length === 0 ? <div className="empty">No users found.</div> : (
              <table>
                <thead>
                  <tr><th>Username</th><th>Full Name</th><th>Email</th><th>Phone</th><th>Country</th><th>Role</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.username}>
                      <td style={{ fontWeight:600, color:"#111827" }}>{u.username}</td>
                      <td>{u.fullName || "—"}</td>
                      <td>{u.email || "—"}</td>
                      <td>{u.phone || "—"}</td>
                      <td>{u.country || "—"}</td>
                      <td style={{ fontSize:"11px", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.5px", color: u.role === "admin" ? "#d97706" : "#1d4ed8", background: u.role === "admin" ? "#fffbeb" : "transparent" }}>{u.role}</td>
                      <td>
                        <button className="btn-edit" onClick={() => { setEditUser(u); setEditForm({ fullName: u.fullName||"", email: u.email||"", phone: u.phone||"", dob: u.dob||"", country: u.country||"", zipCode: u.zipCode||"" }); }}>Edit</button>
                        {u.username !== "admin" && <button className="btn-red" onClick={() => deleteUser(u.username)}>Delete</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === "add user" && (
          <div className="card-c">
            <div className="ct">Create New User</div>
            <form className="add-form" onSubmit={addUser}>
              <div className="fg"><label>Username *</label><input placeholder="jdoe" value={addForm.username} onChange={e => setAddForm({...addForm, username: e.target.value})} required /></div>
              <div className="fg"><label>Password *</label><input type="password" placeholder="••••••••" value={addForm.password} onChange={e => setAddForm({...addForm, password: e.target.value})} required /></div>
              <div className="fg full"><label>Full Name *</label><input placeholder="John Doe" value={addForm.fullName} onChange={e => setAddForm({...addForm, fullName: e.target.value})} required /></div>
              <div className="fg"><label>Email *</label><input type="email" placeholder="user@email.com" value={addForm.email} onChange={e => setAddForm({...addForm, email: e.target.value})} required /></div>
              <div className="fg"><label>Phone</label><input type="tel" placeholder="+1 555 000 0000" value={addForm.phone||""} onChange={e => setAddForm({...addForm, phone: e.target.value})} /></div>
              <div className="fg"><label>Role</label>
                <select value={addForm.role} onChange={e => setAddForm({...addForm, role: e.target.value})}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="fg"><label>Date of Birth</label><input type="date" value={addForm.dob} onChange={e => setAddForm({...addForm, dob: e.target.value})} /></div>
              <div className="fg"><label>Country</label>
                <select value={addForm.country} onChange={e => setAddForm({...addForm, country: e.target.value})}>
                  <option value="">Select</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="fg"><label>Zip Code</label><input placeholder="A1A 1A1" value={addForm.zipCode} onChange={e => setAddForm({...addForm, zipCode: e.target.value})} /></div>
              <div className="form-row">
                <button className="btn-p" type="submit">Create User</button>
                <button className="btn-ghost" type="button" onClick={() => setTab("users")}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {editUser && (
          <div className="modal-bg" onClick={e => { if (e.target === e.currentTarget) setEditUser(null); }}>
            <div className="modal">
              <h3>Edit User — {editUser.username}</h3>
              <form onSubmit={saveEdit}>
                <div className="add-form">
                  <div className="fg full"><label>Full Name</label><input value={editForm.fullName} onChange={e => setEditForm({...editForm, fullName: e.target.value})} /></div>
                  <div className="fg"><label>Email</label><input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} /></div>
                  <div className="fg"><label>Phone</label><input type="tel" value={editForm.phone||""} onChange={e => setEditForm({...editForm, phone: e.target.value})} /></div>
                  <div className="fg"><label>Date of Birth</label><input type="date" value={editForm.dob} onChange={e => setEditForm({...editForm, dob: e.target.value})} /></div>
                  <div className="fg"><label>Country</label>
                    <select value={editForm.country} onChange={e => setEditForm({...editForm, country: e.target.value})}>
                      <option value="">Select</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="fg"><label>Zip Code</label><input value={editForm.zipCode} onChange={e => setEditForm({...editForm, zipCode: e.target.value})} /></div>
                  <div className="form-row">
                    <button className="btn-p" type="submit">Save Changes</button>
                    <button className="btn-ghost" type="button" onClick={() => setEditUser(null)}>Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}