import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.USER_PANEL_URL,
  process.env.ADMIN_PANEL_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

const dbPath = join(__dirname, "db.json");

const readDB = () => {
  const data = readFileSync(dbPath, "utf8");
  return JSON.parse(data);
};

const writeDB = (data) => {
  writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

io.on("connection", (socket) => {
  socket.on("disconnect", () => {});
});
app.get("/users", (req, res) => {
  const db = readDB();
  res.json(db.users);
});

app.get("/users/me", (req, res) => {
  const token = req.cookies.user_token;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const userId = token.replace("mock-token-", "");
  const db = readDB();
  const user = db.users.find((u) => u.id === userId);

  if (!user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

app.get("/users/:id", (req, res) => {
  const db = readDB();
  const user = db.users.find((u) => u.id === req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.post("/users", (req, res) => {
  const db = readDB();
  const newUser = { id: Date.now().toString(), ...req.body };
  db.users.push(newUser);
  writeDB(db);
  res.status(201).json(newUser);
});

app.post("/admin/login", (req, res) => {
  const { email, password } = req.body;
  const db = readDB();

  const user = db.adminUsers.find(
    (u) => u.email === email && u.password === password,
  );

  if (!user) {
    return res.status(401).json({ error: "Email veya şifre hatalı" });
  }

  const token = `mock-token-${user.id}`;
  res.cookie("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  const { password: _, ...userWithoutPassword } = user;
  res.json({
    user: userWithoutPassword,
  });
});

app.post("/admin/logout", (req, res) => {
  res.clearCookie("admin_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.json({ message: "Logout successful" });
});

app.get("/admin/me", (req, res) => {
  const token = req.cookies.admin_token;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const userId = token.replace("mock-token-", "");
  const db = readDB();
  const user = db.adminUsers.find((u) => u.id === userId);

  if (!user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

app.post("/users/login", (req, res) => {
  const { email, password } = req.body;
  const db = readDB();

  const user = db.users.find(
    (u) => u.email === email && u.password === password,
  );

  if (!user) {
    return res.status(401).json({ error: "Email veya şifre hatalı" });
  }

  const token = `mock-token-${user.id}`;
  res.cookie("user_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  const { password: _, ...userWithoutPassword } = user;
  res.json({
    user: userWithoutPassword,
  });
});

app.post("/users/logout", (req, res) => {
  res.clearCookie("user_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.json({ message: "Logout successful" });
});

app.get("/adminUsers", (req, res) => {
  const db = readDB();
  res.json(db.adminUsers);
});

app.get("/adminUsers/:id", (req, res) => {
  const db = readDB();
  const user = db.adminUsers.find((u) => u.id === req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "Admin user not found" });
  }
});

app.post("/adminUsers", (req, res) => {
  const db = readDB();
  const newUser = { id: Date.now().toString(), ...req.body };
  db.adminUsers.push(newUser);
  writeDB(db);
  res.status(201).json(newUser);
});

app.delete("/adminUsers/:id", (req, res) => {
  const db = readDB();
  db.adminUsers = db.adminUsers.filter((u) => u.id !== req.params.id);
  writeDB(db);
  res.status(204).send();
});

app.patch("/adminUsers/:id", (req, res) => {
  const db = readDB();
  const userIndex = db.adminUsers.findIndex((u) => u.id === req.params.id);

  if (userIndex === -1) {
    return res.status(404).json({ error: "Admin user not found" });
  }

  const currentUser = db.adminUsers[userIndex];
  const updatedUser = {
    ...currentUser,
    ...req.body,
  };

  if (!req.body.password) {
    updatedUser.password = currentUser.password;
  }

  db.adminUsers[userIndex] = updatedUser;
  writeDB(db);

  res.json(userWithoutPassword);
});

app.get("/tasks", (req, res) => {
  const db = readDB();
  const sortedTasks = [...db.tasks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  res.json(sortedTasks);
});

app.get("/tasks/:id", (req, res) => {
  const db = readDB();
  const task = db.tasks.find((t) => t.id === req.params.id);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.post("/tasks", (req, res) => {
  const db = readDB();
  const newTask = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  db.tasks.push(newTask);
  writeDB(db);

  io.emit("task:created", newTask);

  res.status(201).json(newTask);
});

app.patch("/tasks/:id", (req, res) => {
  const db = readDB();
  const taskIndex = db.tasks.findIndex((t) => t.id === req.params.id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  db.tasks[taskIndex] = { ...db.tasks[taskIndex], ...req.body };
  writeDB(db);

  io.emit("task:updated", { task: db.tasks[taskIndex] });

  res.json(db.tasks[taskIndex]);
});

app.put("/tasks/:id", (req, res) => {
  const db = readDB();
  const taskIndex = db.tasks.findIndex((t) => t.id === req.params.id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  db.tasks[taskIndex] = { id: req.params.id, ...req.body };
  writeDB(db);

  io.emit("task:updated", { task: db.tasks[taskIndex] });

  res.json(db.tasks[taskIndex]);
});

app.delete("/tasks/:id", (req, res) => {
  const db = readDB();
  const deletedTaskId = req.params.id;
  db.tasks = db.tasks.filter((t) => t.id !== deletedTaskId);
  writeDB(db);

  io.emit("task:deleted", { taskId: deletedTaskId });

  res.status(204).send();
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
