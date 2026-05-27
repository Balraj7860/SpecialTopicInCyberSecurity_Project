export default function Dashboard({ user }) {
  return (
    <section style={styles.page}>
      <h1 style={styles.title}>Dashboard</h1>
      <p style={styles.welcome}>Welcome, {user.username}</p>
      <div style={styles.grid}>
        <div style={styles.panel}>
          <span style={styles.label}>Checking Balance</span>
          <strong style={styles.value}>$12,450.00</strong>
        </div>
        <div style={styles.panel}>
          <span style={styles.label}>Savings Balance</span>
          <strong style={styles.value}>$38,910.00</strong>
        </div>
        <div style={styles.panel}>
          <span style={styles.label}>Account Status</span>
          <strong style={styles.value}>Active</strong>
        </div>
      </div>
    </section>
  );
}

const styles = {
  page: {
    padding: 30,
  },
  title: {
    color: "#d4af37",
  },
  welcome: {
    color: "#ccc",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },
  panel: {
    background: "#111",
    borderLeft: "4px solid #d4af37",
    padding: 20,
  },
  label: {
    display: "block",
    color: "#ccc",
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
  },
};
