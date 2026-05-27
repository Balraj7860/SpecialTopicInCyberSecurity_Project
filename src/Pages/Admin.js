import { useEffect, useState } from "react";

export default function Admin() {
  const [users, setUsers] = useState({});
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "user",
    email: "",
    phone: "",
    sin: "",
  });

  // LOAD USERS
  const loadUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Could not load users.");
        return;
      }

      setUsers(data);
    } catch (error) {
      setMessage("Could not connect to the admin server. Make sure your backend is running on port 5000.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ADD USER
  const addUser = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/admin/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMessage(data.message || data.error);

      loadUsers();
    } catch (error) {
      setMessage("Could not connect to the admin server. Make sure your backend is running on port 5000.");
    }
  };

  // DELETE USER
  const deleteUser = async (username) => {
    try {
      const res = await fetch("http://localhost:5000/admin/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username }),
      });

      const data = await res.json();
      setMessage(data.message || data.error);

      loadUsers();
    } catch (error) {
      setMessage("Could not connect to the admin server. Make sure your backend is running on port 5000.");
    }
  };

  return (
    <div style={styles.body}>
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <div style={styles.logo}>ADMIN PANEL</div>
        <a href="#dashboard" style={styles.link}>
          Dashboard
        </a>
      </div>

      <div style={styles.container}>
        <h1>User Management</h1>

        {message && <div style={styles.message}>{message}</div>}

        {/* ADD USER FORM */}
        <div style={styles.panel}>
          <h2>Add User</h2>

          <form onSubmit={addUser} style={styles.grid}>
            <input
              placeholder="Username"
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />

            <input
              placeholder="Password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <select
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <input
              placeholder="Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              placeholder="Phone"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <input
              placeholder="SIN"
              onChange={(e) => setForm({ ...form, sin: e.target.value })}
            />

            <button style={styles.addBtn}>Add User</button>
          </form>
        </div>

        {/* USER TABLE */}
        <div style={styles.panel}>
          <h2>All Users</h2>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Email</th>
                <th>Phone</th>
                <th>SIN</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(users).map(([username, user]) => (
                <tr key={username}>
                  <td>{username}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.sin}</td>
                  <td>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => deleteUser(username)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  body: {
    background: "#0b0b0b",
    color: "#fff",
    minHeight: "100vh",
    fontFamily: "Arial",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 30px",
    borderBottom: "2px solid gold",
  },
  logo: { color: "gold", fontWeight: "bold" },
  link: { color: "gold", textDecoration: "none" },
  container: { padding: 30 },

  message: {
    padding: 10,
    border: "1px solid gold",
    marginBottom: 15,
    color: "gold",
  },

  panel: {
    background: "#111",
    padding: 20,
    marginBottom: 20,
    borderLeft: "4px solid gold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 10,
  },

  table: {
    width: "100%",
    marginTop: 10,
  },

  addBtn: {
    gridColumn: "span 2",
    padding: 10,
    background: "gold",
    border: "none",
    cursor: "pointer",
  },

  deleteBtn: {
    background: "darkred",
    color: "white",
    border: "none",
    padding: 8,
    cursor: "pointer",
  },
};
