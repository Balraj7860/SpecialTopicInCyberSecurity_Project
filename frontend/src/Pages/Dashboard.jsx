import { useState, useEffect } from "react";

const CARD_TYPES  = { visa:"Visa", mastercard:"Mastercard", amex:"Amex", other:"Other" };
const CARD_COLORS = { visa:"#1d4ed8", mastercard:"#dc2626", amex:"#059669", other:"#6b7280" };

export default function Dashboard({ user }) {
  const [tab, setTab]               = useState("overview");
  const [cards, setCards]           = useState([]);
  const [txs, setTxs]               = useState([]);
  const [profile, setProfile]       = useState(user);
  const [msg, setMsg]               = useState({ text:"", type:"" });
  const [cardForm, setCardForm]     = useState({ label:"", number:"", holder:"", expiry:"", type:"visa" });
  const [txForm, setTxForm]         = useState({ desc:"", amount:"", type:"debit" });
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [pwForm, setPwForm]         = useState({ current:"", newPassword:"", confirm:"" });

  const ok  = (t) => setMsg({ text:t, type:"success" });
  const err = (t) => setMsg({ text:t, type:"error" });

  const loadCards = async () => {
    try {
      const r = await fetch("http://localhost:5001/cards", { credentials:"include" });
      if (r.ok) { setCards(await r.json()); }
    } catch {}
  };

  const loadTxs = async () => {
    try {
      const r = await fetch("http://localhost:5001/transactions", { credentials:"include" });
      if (r.ok) { setTxs(await r.json()); }
    } catch {}
  };

  const loadProfile = async () => {
    try {
      const r = await fetch("http://localhost:5001/profile", { credentials:"include" });
      if (r.ok) {
        const d = await r.json();
        setProfile(d);
        setProfileForm(d);
      }
    } catch {}
  };

  useEffect(() => { loadCards(); loadTxs(); loadProfile(); }, []);

  const addCard = async (e) => {
    e.preventDefault();
    setMsg({ text:"", type:"" });
    try {
      const r = await fetch("http://localhost:5001/cards/add", {
        method:"POST", headers:{"Content-Type":"application/json"},
        credentials:"include", body:JSON.stringify(cardForm)
      });
      const d = await r.json();
      if (r.ok) {
        ok(d.message);
        setCardForm({ label:"", number:"", holder:"", expiry:"", type:"visa" });
        loadCards();
      } else {
        err(d.error);
      }
    } catch { err("Could not connect."); }
  };

  const deleteCard = async (id) => {
    try {
      const r = await fetch("http://localhost:5001/cards/delete", {
        method:"DELETE", headers:{"Content-Type":"application/json"},
        credentials:"include", body:JSON.stringify({ id })
      });
      if (r.ok) { ok("Card removed."); loadCards(); }
    } catch {}
  };

  const addTx = async (e) => {
    e.preventDefault();
    setMsg({ text:"", type:"" });
    try {
      const r = await fetch("http://localhost:5001/transactions/add", {
        method:"POST", headers:{"Content-Type":"application/json"},
        credentials:"include", body:JSON.stringify({ ...txForm, amount: parseFloat(txForm.amount) })
      });
      const d = await r.json();
      if (r.ok) {
        ok(d.message);
        setTxForm({ desc:"", amount:"", type:"debit" });
        loadTxs();
      } else {
        err(d.error);
      }
    } catch { err("Could not connect."); }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setMsg({ text:"", type:"" });
    try {
      const r = await fetch("http://localhost:5001/profile", {
        method:"PUT", headers:{"Content-Type":"application/json"},
        credentials:"include", body:JSON.stringify(profileForm)
      });
      const d = await r.json();
      if (r.ok) {
        ok(d.message);
        setProfile(d.user);
        setEditProfile(false);
      } else {
        err(d.error);
      }
    } catch { err("Could not connect."); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setMsg({ text:"", type:"" });
    if (pwForm.newPassword !== pwForm.confirm) { err("New passwords do not match."); return; }
    try {
      const r = await fetch("http://localhost:5001/password", {
        method:"PUT", headers:{"Content-Type":"application/json"},
        credentials:"include", body:JSON.stringify({ current: pwForm.current, newPassword: pwForm.newPassword })
      });
      const d = await r.json();
      if (r.ok) {
        ok(d.message);
        setPwForm({ current:"", newPassword:"", confirm:"" });
      } else {
        err(d.error);
      }
    } catch { err("Could not connect."); }
  };

  const maskCard = (n) => n ? "**** **** **** " + n.replace(/\s/g,"").slice(-4) : "•••• •••• •••• ••••";
  const totalBalance = txs.reduce((sum, t) => t.type === "credit" ? sum + t.amount : sum - t.amount, 0);

  const COUNTRIES = ["Canada","United States","Mexico","Colombia","Brazil","Argentina","Spain","United Kingdom","Germany","France","Australia","Other"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .dash   { min-height:calc(100vh - 56px);background:#f3f4f6;font-family:'Inter',sans-serif;padding:28px 32px; }
        .ph     { margin-bottom:22px; }
        .ph h2  { font-size:22px;font-weight:700;color:#111827;margin-bottom:2px; }
        .ph p   { font-size:13px;color:#6b7280; }
        .tabs   { display:flex;border-bottom:2px solid #e5e7eb;margin-bottom:22px; }
        .tab    { background:none;border:none;border-bottom:2px solid transparent;margin-bottom:-2px;padding:9px 16px;font-size:13px;font-weight:500;color:#6b7280;cursor:pointer;font-family:'Inter',sans-serif;transition:color 0.15s; }
        .tab:hover{ color:#374151; }
        .tab.active{ color:#1d4ed8;border-bottom-color:#1d4ed8;font-weight:600; }
        .stats  { display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-bottom:18px; }
        .stat   { background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:16px 18px; }
        .sl     { font-size:12px;color:#6b7280;font-weight:500;margin-bottom:6px; }
        .sv     { font-size:22px;font-weight:700;color:#111827; }
        .ss     { font-size:11px;color:#6b7280;margin-top:4px; }
        .card-c { background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:20px 22px;margin-bottom:16px; }
        .ct     { font-size:14px;font-weight:600;color:#111827;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid #f3f4f6; }
        .msg-box{ padding:9px 12px;border-radius:6px;font-size:13px;margin-bottom:14px; }
        .msg-box.success{ background:#f0fdf4;border:1px solid #bbf7d0;color:#16a34a; }
        .msg-box.error  { background:#fef2f2;border:1px solid #fecaca;color:#dc2626; }
        .add-form{ display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;align-items:end; }
        .fg     { display:flex;flex-direction:column;gap:5px; }
        .fg label{ font-size:12px;font-weight:500;color:#374151; }
        .fg input,.fg select{ padding:8px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;font-family:'Inter',sans-serif;color:#111827;outline:none;background:#fff; }
        .fg input:focus,.fg select:focus{ border-color:#1d4ed8;box-shadow:0 0 0 2px rgba(29,78,216,0.1); }
        .btn-p  { padding:8px 16px;background:#1d4ed8;color:#fff;border:none;border-radius:6px;font-size:13px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;white-space:nowrap;height:fit-content;transition:background 0.15s; }
        .btn-p:hover{ background:#1e40af; }
        .btn-ghost{ padding:8px 14px;background:#f9fafb;color:#374151;border:1px solid #e5e7eb;border-radius:6px;font-size:13px;font-weight:500;font-family:'Inter',sans-serif;cursor:pointer; }
        .btn-ghost:hover{ background:#f3f4f6; }
        .btn-red{ padding:5px 10px;border:1px solid #fecaca;background:#fef2f2;color:#dc2626;border-radius:5px;font-size:12px;font-weight:500;cursor:pointer;font-family:'Inter',sans-serif; }
        .btn-red:hover{ background:#fee2e2; }
        .card-row{ display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #f3f4f6;gap:12px;flex-wrap:wrap; }
        .card-row:last-child{ border-bottom:none; }
        .card-tag{ display:inline-block;font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;color:#fff;text-transform:uppercase;letter-spacing:0.5px;flex-shrink:0; }
        .card-label{ font-size:14px;font-weight:500;color:#111827;flex:1; }
        .card-num  { font-size:13px;color:#6b7280;font-family:monospace;flex:1; }
        .card-exp  { font-size:12px;color:#9ca3af;flex-shrink:0; }
        .tx-row    { display:flex;justify-content:space-between;align-items:center;padding:11px 0;border-bottom:1px solid #f3f4f6; }
        .tx-row:last-child{ border-bottom:none; }
        .tx-desc   { font-size:13px;font-weight:500;color:#111827; }
        .tx-date   { font-size:11px;color:#9ca3af;margin-top:2px; }
        .tx-amt    { font-size:14px;font-weight:600; }
        .green{ color:#10b981; } .red{ color:#ef4444; }
        .info-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:16px; }
        .ik{ font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px; }
        .iv{ font-size:14px;font-weight:500;color:#111827; }
        .pw-form{ display:grid;gap:12px;max-width:340px; }
        .empty{ text-align:center;padding:28px;color:#9ca3af;font-size:13px; }
        @media(max-width:600px){ .dash{padding:16px;} .add-form{grid-template-columns:1fr;} }
      `}</style>

      <div className="dash">
        <div className="ph">
          <h2>Hello, {profile.fullName || profile.username} 👋</h2>
          <p>DBI Wallet · {new Date().toLocaleDateString("en-CA",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
        </div>

        <div className="tabs">
          {["overview","my cards","transactions","profile","security"].map(t => (
            <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => { setTab(t); setMsg({ text:"", type:"" }); }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {msg.text && <div className={`msg-box ${msg.type}`}>{msg.text}</div>}

        {/* OVERVIEW */}
        {tab === "overview" && (
          <>
            <div className="stats">
              <div className="stat">
                <div className="sl">Total Balance</div>
                <div className="sv" style={{ color: totalBalance >= 0 ? "#111827" : "#ef4444" }}>${Math.abs(totalBalance).toFixed(2)}</div>
                <div className="ss">{totalBalance >= 0 ? "Available funds" : "Negative balance"}</div>
              </div>
              <div className="stat"><div className="sl">Saved Cards</div><div className="sv">{cards.length}</div><div className="ss">Linked to wallet</div></div>
              <div className="stat"><div className="sl">Transactions</div><div className="sv">{txs.length}</div><div className="ss">Total recorded</div></div>
              <div className="stat"><div className="sl">Account</div><div className="sv" style={{fontSize:15,paddingTop:4,color:"#10b981"}}>● Active</div><div className="ss">{profile.country || "—"}</div></div>
            </div>
            <div className="card-c">
              <div className="ct">Recent Transactions</div>
              {txs.length === 0 ? (
                <div className="empty">No transactions yet. Add one in the Transactions tab.</div>
              ) : (
                [...txs].reverse().slice(0,5).map(tx => (
                  <div className="tx-row" key={tx.id}>
                    <div><div className="tx-desc">{tx.desc}</div><div className="tx-date">{tx.date}</div></div>
                    <span className={`tx-amt ${tx.type === "credit" ? "green" : "red"}`}>
                      {tx.type === "credit" ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* MY CARDS */}
        {tab === "my cards" && (
          <>
            <div className="card-c">
              <div className="ct">Add New Card</div>
              <form className="add-form" onSubmit={addCard}>
                <div className="fg">
                  <label>Type</label>
                  <select value={cardForm.type} onChange={e => setCardForm({...cardForm, type: e.target.value})}>
                    {Object.entries(CARD_TYPES).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div className="fg"><label>Label</label><input placeholder="e.g. Personal Visa" value={cardForm.label} onChange={e => setCardForm({...cardForm, label: e.target.value})} /></div>
                <div className="fg"><label>Card Number *</label><input placeholder="4111 1111 1111 1234" value={cardForm.number} onChange={e => setCardForm({...cardForm, number: e.target.value})} required /></div>
                <div className="fg"><label>Cardholder Name *</label><input placeholder="John Doe" value={cardForm.holder} onChange={e => setCardForm({...cardForm, holder: e.target.value})} required /></div>
                <div className="fg"><label>Expiry *</label><input placeholder="MM/YY" value={cardForm.expiry} onChange={e => setCardForm({...cardForm, expiry: e.target.value})} required /></div>
                <button className="btn-p" type="submit">Add Card</button>
              </form>
            </div>
            <div className="card-c">
              <div className="ct">My Cards ({cards.length})</div>
              {cards.length === 0 ? <div className="empty">No cards saved yet.</div> : (
                cards.map(c => (
                  <div className="card-row" key={c.id}>
                    <span className="card-tag" style={{ background: CARD_COLORS[c.type] || "#6b7280" }}>{CARD_TYPES[c.type] || c.type}</span>
                    <span className="card-label">{c.label}</span>
                    <span className="card-num">{maskCard(c.number)}</span>
                    <span className="card-exp">Exp. {c.expiry}</span>
                    <button className="btn-red" onClick={() => deleteCard(c.id)}>Remove</button>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* TRANSACTIONS */}
        {tab === "transactions" && (
          <>
            <div className="card-c">
              <div className="ct">Add Transaction</div>
              <form className="add-form" onSubmit={addTx}>
                <div className="fg">
                  <label>Type</label>
                  <select value={txForm.type} onChange={e => setTxForm({...txForm, type: e.target.value})}>
                    <option value="debit">Debit (−)</option>
                    <option value="credit">Credit (+)</option>
                  </select>
                </div>
                <div className="fg"><label>Description *</label><input placeholder="e.g. Grocery Store" value={txForm.desc} onChange={e => setTxForm({...txForm, desc: e.target.value})} required /></div>
                <div className="fg"><label>Amount *</label><input type="number" step="0.01" min="0" placeholder="0.00" value={txForm.amount} onChange={e => setTxForm({...txForm, amount: e.target.value})} required /></div>
                <button className="btn-p" type="submit">Add</button>
              </form>
            </div>
            <div className="card-c">
              <div className="ct">Transaction History ({txs.length})</div>
              {txs.length === 0 ? <div className="empty">No transactions yet.</div> : (
                [...txs].reverse().map(tx => (
                  <div className="tx-row" key={tx.id}>
                    <div><div className="tx-desc">{tx.desc}</div><div className="tx-date">{tx.date}</div></div>
                    <span className={`tx-amt ${tx.type === "credit" ? "green" : "red"}`}>
                      {tx.type === "credit" ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* PROFILE */}
        {tab === "profile" && (
          <div className="card-c">
            <div className="ct" style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              Personal Information
              {!editProfile && <button className="btn-ghost" onClick={() => { setEditProfile(true); setProfileForm(profile); }}>Edit</button>}
            </div>
            {editProfile ? (
              <form onSubmit={saveProfile}>
                <div className="info-grid" style={{ marginBottom:16 }}>
                  {[["Full Name","fullName","text"],["Email","email","email"],["Phone","phone","tel"],["Date of Birth","dob","date"],["Zip / Postal Code","zipCode","text"]].map(([l,k,t]) => (
                    <div className="fg" key={k}>
                      <label>{l}</label>
                      <input type={t} value={profileForm[k] || ""} onChange={e => setProfileForm({...profileForm, [k]: e.target.value})} />
                    </div>
                  ))}
                  <div className="fg">
                    <label>Country</label>
                    <select value={profileForm.country || ""} onChange={e => setProfileForm({...profileForm, country: e.target.value})}>
                      <option value="">Select</option>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button className="btn-p" type="submit">Save Changes</button>
                  <button className="btn-ghost" type="button" onClick={() => setEditProfile(false)}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className="info-grid">
                {[["Username",profile.username],["Full Name",profile.fullName||"—"],["Email",profile.email||"—"],["Phone",profile.phone||"—"],["Date of Birth",profile.dob||"—"],["Country",profile.country||"—"],["Zip Code",profile.zipCode||"—"],["Role",profile.role]].map(([k,v]) => (
                  <div key={k}><div className="ik">{k}</div><div className="iv">{v}</div></div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECURITY */}
        {tab === "security" && (
          <div className="card-c">
            <div className="ct">Change Password</div>
            <form className="pw-form" onSubmit={changePassword}>
              {[["Current Password","current"],["New Password","newPassword"],["Confirm New Password","confirm"]].map(([l,k]) => (
                <div className="fg" key={k}>
                  <label>{l}</label>
                  <input type="password" placeholder="••••••••" value={pwForm[k]} onChange={e => setPwForm({...pwForm, [k]: e.target.value})} />
                </div>
              ))}
              <button className="btn-p" type="submit" style={{ width:"fit-content" }}>Update Password</button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}