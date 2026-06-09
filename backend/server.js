const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "dev-only-secure-wallet-secret-change-me";
const AUTH_COOKIE = "auth_token";

let nextCardId = 1;
let nextTransactionId = 1;

const users = {
  user: {
    password: "user123",
    role: "user",
    fullName: "Demo User",
    email: "user@securewallet.local",
    dob: "1998-01-01",
    country: "Canada",
    zipCode: "A1A 1A1",
    phone: "555-0101",
    sin: "123-456-789",
  },
  admin: {
    password: "admin123",
    role: "admin",
    fullName: "Demo Admin",
    email: "admin@securewallet.local",
    dob: "1995-01-01",
    country: "Canada",
    zipCode: "V3M 5Z5",
    phone: "555-0100",
    sin: "987-654-321",
  },
};

const cardsByUser = {
  user: [],
  admin: [],
};

const transactionsByUser = {
  user: [],
  admin: [],
};

const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
]);

const PASSWORD_RULE = "Password must be at least 8 characters and include one uppercase letter and one symbol.";
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

app.use(express.json());
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.has(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

function parseCookies(cookieHeader = "") {
  return cookieHeader.split(";").reduce((cookies, pair) => {
    const [rawName, ...rawValue] = pair.trim().split("=");
    if (!rawName) return cookies;
    cookies[rawName] = decodeURIComponent(rawValue.join("="));
    return cookies;
  }, {});
}

function getToken(req) {
  const authHeader = req.headers.authorization || "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  return parseCookies(req.headers.cookie)[AUTH_COOKIE] || bearerToken;
}

function authCookieOptions() {
  return [
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    "Max-Age=86400",
    process.env.NODE_ENV === "production" ? "Secure" : "",
  ].filter(Boolean).join("; ");
}

function issueAuthToken(res, username) {
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1d" });
  res.setHeader("Set-Cookie", `${AUTH_COOKIE}=${encodeURIComponent(token)}; ${authCookieOptions()}`);
}

function requireLogin(req, res, next) {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ error: "Please log in first." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = users[payload.username];

    if (!user) {
      return res.status(401).json({ error: "Invalid or expired session." });
    }

    req.user = publicUser(payload.username, user);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session." });
  }
}

function requireAdmin(req, res, next) {
  return requireLogin(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required." });
    }

    return next();
  });
}

function publicUser(username, user) {
  return {
    username,
    role: user.role,
    fullName: user.fullName || "",
    email: user.email || "",
    dob: user.dob || "",
    country: user.country || "",
    zipCode: user.zipCode || "",
    phone: user.phone || "",
    sin: user.sin || "",
  };
}

function ensureUserCollections(username) {
  if (!cardsByUser[username]) cardsByUser[username] = [];
  if (!transactionsByUser[username]) transactionsByUser[username] = [];
}

function createUser(payload, defaultRole = "user") {
  const username = String(payload.username || "").trim();
  const password = String(payload.password || "");
  const role = payload.role || defaultRole;

  if (!username || !password || !role) {
    return { error: "Username, password, and role are required.", status: 400 };
  }

  if (!PASSWORD_REGEX.test(password)) {
    return { error: PASSWORD_RULE, status: 400 };
  }

  if (users[username]) {
    return { error: "That username already exists.", status: 409 };
  }

  if (!["user", "admin"].includes(role)) {
    return { error: "Role must be user or admin.", status: 400 };
  }

  users[username] = {
    password,
    role,
    fullName: payload.fullName || "",
    email: payload.email || "",
    dob: payload.dob || "",
    country: payload.country || "",
    zipCode: payload.zipCode || "",
    phone: payload.phone || "",
    sin: payload.sin || "",
  };

  ensureUserCollections(username);

  return { user: publicUser(username, users[username]) };
}

function updateUser(username, payload) {
  if (!username || !users[username]) {
    return { error: "User not found.", status: 404 };
  }

  const editableFields = ["fullName", "email", "dob", "country", "zipCode", "phone", "sin"];

  for (const field of editableFields) {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      users[username][field] = payload[field] || "";
    }
  }

  if (payload.role) {
    if (!["user", "admin"].includes(payload.role)) {
      return { error: "Role must be user or admin.", status: 400 };
    }

    users[username].role = payload.role;
  }

  return { user: publicUser(username, users[username]) };
}

function deleteUser(username, currentUsername) {
  if (!username || !users[username]) {
    return { error: "User not found.", status: 404 };
  }

  if (username === currentUsername) {
    return { error: "You cannot delete your own account while logged in.", status: 400 };
  }

  delete users[username];
  delete cardsByUser[username];
  delete transactionsByUser[username];

  return {};
}

app.get("/", (req, res) => {
  res.json({ message: "Secure Wallet backend is running." });
});

app.post("/register", (req, res) => {
  const result = createUser({ ...req.body, role: "user" }, "user");

  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }

  issueAuthToken(res, result.user.username);
  res.status(201).json(result.user);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  issueAuthToken(res, username);
  res.json(publicUser(username, user));
});

app.post("/logout", (req, res) => {
  res.setHeader("Set-Cookie", `${AUTH_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`);
  res.json({ message: "Logged out successfully." });
});

app.get("/me", requireLogin, (req, res) => {
  res.json(req.user);
});

app.get("/profile", requireLogin, (req, res) => {
  res.json(publicUser(req.user.username, users[req.user.username]));
});

app.put("/profile", requireLogin, (req, res) => {
  const result = updateUser(req.user.username, req.body);

  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }

  res.json({ message: "Profile updated successfully.", user: result.user });
});

app.put("/password", requireLogin, (req, res) => {
  const { current, newPassword } = req.body;
  const user = users[req.user.username];

  if (!current || !newPassword) {
    return res.status(400).json({ error: "Current password and new password are required." });
  }

  if (user.password !== current) {
    return res.status(401).json({ error: "Current password is incorrect." });
  }

  if (!PASSWORD_REGEX.test(newPassword)) {
    return res.status(400).json({ error: PASSWORD_RULE });
  }

  user.password = newPassword;
  res.json({ message: "Password updated successfully." });
});

app.get("/admin", requireAdmin, (req, res) => {
  const safeUsers = Object.fromEntries(
    Object.entries(users).map(([username, user]) => [username, publicUser(username, user)])
  );

  res.json(safeUsers);
});

app.get("/admin/users", requireAdmin, (req, res) => {
  res.json(Object.entries(users).map(([username, user]) => publicUser(username, user)));
});

app.post(["/admin/add", "/admin/users/add"], requireAdmin, (req, res) => {
  const result = createUser(req.body);

  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }

  res.status(201).json({ message: "User added successfully.", user: result.user });
});

app.put("/admin/users/edit", requireAdmin, (req, res) => {
  const { username, ...updates } = req.body;
  const result = updateUser(username, updates);

  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }

  res.json({ message: "User updated successfully.", user: result.user });
});

app.delete(["/admin/delete", "/admin/users/delete"], requireAdmin, (req, res) => {
  const result = deleteUser(req.body.username, req.user.username);

  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }

  res.json({ message: "User deleted successfully." });
});

app.get("/cards", requireLogin, (req, res) => {
  ensureUserCollections(req.user.username);
  res.json(cardsByUser[req.user.username]);
});

app.post("/cards/add", requireLogin, (req, res) => {
  const { label, number, holder, expiry, type } = req.body;

  if (!number || !holder || !expiry) {
    return res.status(400).json({ error: "Card number, holder, and expiry are required." });
  }

  ensureUserCollections(req.user.username);

  const card = {
    id: nextCardId++,
    label: label || "Saved Card",
    number,
    holder,
    expiry,
    type: type || "other",
  };

  cardsByUser[req.user.username].push(card);
  res.status(201).json({ message: "Card added successfully.", card });
});

app.delete("/cards/delete", requireLogin, (req, res) => {
  ensureUserCollections(req.user.username);

  const id = Number(req.body.id);
  const before = cardsByUser[req.user.username].length;
  cardsByUser[req.user.username] = cardsByUser[req.user.username].filter((card) => card.id !== id);

  if (cardsByUser[req.user.username].length === before) {
    return res.status(404).json({ error: "Card not found." });
  }

  res.json({ message: "Card removed successfully." });
});

app.get("/transactions", requireLogin, (req, res) => {
  ensureUserCollections(req.user.username);
  res.json(transactionsByUser[req.user.username]);
});

app.post("/transactions/add", requireLogin, (req, res) => {
  const { desc, amount, type } = req.body;
  const numericAmount = Number(amount);

  if (!desc || Number.isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ error: "Description and a positive amount are required." });
  }

  if (!["credit", "debit"].includes(type)) {
    return res.status(400).json({ error: "Transaction type must be credit or debit." });
  }

  ensureUserCollections(req.user.username);

  const transaction = {
    id: nextTransactionId++,
    desc,
    amount: numericAmount,
    type,
    date: new Date().toLocaleDateString("en-CA"),
  };

  transactionsByUser[req.user.username].push(transaction);
  res.status(201).json({ message: "Transaction added successfully.", transaction });
});

app.listen(PORT, () => {
  console.log(`Secure Wallet backend running on http://localhost:${PORT}`);
});
