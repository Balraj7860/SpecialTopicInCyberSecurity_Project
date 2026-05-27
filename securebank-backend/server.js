const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;
let currentUser = null;

const users = {
  user: {
    password: "user123",
    role: "user",
    email: "user@securebank.local",
    phone: "555-0101",
    sin: "123-456-789",
  },
  admin: {
    password: "admin123",
    role: "admin",
    email: "admin@securebank.local",
    phone: "555-0100",
    sin: "987-654-321",
  },
};

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

function requireLogin(req, res, next) {
  if (!currentUser) {
    return res.status(401).json({ error: "Please log in first." });
  }

  next();
}

function requireAdmin(req, res, next) {
  if (!currentUser || currentUser.role !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }

  next();
}

function publicUser(username, user) {
  return {
    username,
    role: user.role,
    email: user.email,
    phone: user.phone,
    sin: user.sin,
  };
}

app.get("/", (req, res) => {
  res.json({ message: "SecureBank backend is running." });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  currentUser = publicUser(username, user);
  res.json(currentUser);
});

app.post("/logout", (req, res) => {
  currentUser = null;
  res.json({ message: "Logged out successfully." });
});

app.get("/me", requireLogin, (req, res) => {
  res.json(currentUser);
});

app.get("/admin", requireAdmin, (req, res) => {
  const safeUsers = Object.fromEntries(
    Object.entries(users).map(([username, user]) => [username, publicUser(username, user)])
  );

  res.json(safeUsers);
});

app.post("/admin/add", requireAdmin, (req, res) => {
  const { username, password, role, email, phone, sin } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: "Username, password, and role are required." });
  }

  if (users[username]) {
    return res.status(409).json({ error: "That username already exists." });
  }

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "Role must be user or admin." });
  }

  users[username] = {
    password,
    role,
    email: email || "",
    phone: phone || "",
    sin: sin || "",
  };

  res.status(201).json({ message: "User added successfully." });
});

app.delete("/admin/delete", requireAdmin, (req, res) => {
  const { username } = req.body;

  if (!username || !users[username]) {
    return res.status(404).json({ error: "User not found." });
  }

  if (username === currentUser.username) {
    return res.status(400).json({ error: "You cannot delete your own account while logged in." });
  }

  delete users[username];
  res.json({ message: "User deleted successfully." });
});

app.listen(PORT, () => {
  console.log(`SecureBank backend running on http://localhost:${PORT}`);
});
