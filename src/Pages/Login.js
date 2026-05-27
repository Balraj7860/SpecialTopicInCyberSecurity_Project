import { useState } from "react";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Login failed");
        return;
      }

      onLogin({
        username: data.username || form.username,
        role: data.role || "user",
      });
    } catch (error) {
      setMessage("Could not connect to the login server. Make sure your backend is running on port 5000.");
    }
  };

  return (
    <section style={styles.page}>
      <div style={styles.panel}>
        <h1 style={styles.title}>SecureBank Login</h1>
        {message && <div style={styles.message}>{message}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Username
            <input
              style={styles.input}
              type="text"
              name="username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </label>
          <label style={styles.label}>
            Password
            <input
              style={styles.input}
              type="password"
              name="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>
          <button style={styles.button} type="submit">
            Sign in
          </button>
        </form>
      </div>
    </section>
  );
}

const styles = {
  page: {
    minHeight: "calc(100vh - 65px)",
    display: "grid",
    placeItems: "center",
    padding: 24,
  },
  panel: {
    width: "min(420px, 100%)",
    background: "#111",
    border: "1px solid #d4af37",
    padding: 24,
  },
  title: {
    marginTop: 0,
    color: "#d4af37",
  },
  form: {
    display: "grid",
    gap: 16,
  },
  message: {
    padding: 10,
    border: "1px solid #d4af37",
    color: "#d4af37",
    marginBottom: 16,
  },
  label: {
    display: "grid",
    gap: 6,
  },
  input: {
    padding: 10,
    border: "1px solid #444",
    background: "#050505",
    color: "#fff",
  },
  button: {
    padding: 12,
    border: "none",
    background: "#d4af37",
    color: "#111",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
