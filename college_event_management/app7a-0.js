// College Event Management System
// Start with: npm start
const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Event photos are stored as data URLs in MySQL. Keep JSON limit high enough for images.
app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ extended: true, limit: "8mb" }));
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_NAME || "school"
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
    console.error("Check MySQL is running, database 'school' exists, and DB credentials in app7a-0.js are correct.");
    return;
  }
  console.log("Connected to MySQL database 'school'.");
});

function databaseReady(res) {
  if (!db || !db.threadId) {
    res.status(503).json({ error: "Database is not connected. Check MySQL and your database settings, then restart the server." });
    return false;
  }
  return true;
}

// READ: list events; optional search by event name, type, venue or description
app.get("/events", (req, res) => {
  if (!databaseReady(res)) return;
  const search = String(req.query.search || "").trim();
  const sql = search
    ? "SELECT * FROM event WHERE EventName LIKE ? OR Type LIKE ? OR Venue LIKE ? OR Description LIKE ? ORDER BY `Date` DESC, EventID DESC"
    : "SELECT * FROM event ORDER BY `Date` DESC, EventID DESC";
  const values = search ? Array(4).fill(`%${search}%`) : [];
  db.query(sql, values, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// READ: one event
app.get("/events/:id", (req, res) => {
  if (!databaseReady(res)) return;
  db.query("SELECT * FROM event WHERE EventID = ?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(404).json({ error: "Event not found." });
    res.json(rows[0]);
  });
});

// CREATE: add an event
app.post("/events", (req, res) => {
  if (!databaseReady(res)) return;
  const { EventName, Type, Date, Venue, Description, Photos } = req.body;
  if (!EventName || !Type || !Date || !Venue) {
    return res.status(400).json({ error: "Event name, type, date and venue are required." });
  }
  const sql = "INSERT INTO event (EventName, Type, `Date`, Venue, Description, Photos) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [EventName.trim(), Type.trim(), Date, Venue.trim(), Description || "", Photos || null], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Event added successfully.", EventID: result.insertId });
  });
});

// UPDATE: edit an event
app.put("/events/:id", (req, res) => {
  if (!databaseReady(res)) return;
  const { EventName, Type, Date, Venue, Description, Photos } = req.body;
  if (!EventName || !Type || !Date || !Venue) {
    return res.status(400).json({ error: "Event name, type, date and venue are required." });
  }
  const sql = "UPDATE event SET EventName=?, Type=?, `Date`=?, Venue=?, Description=?, Photos=? WHERE EventID=?";
  db.query(sql, [EventName.trim(), Type.trim(), Date, Venue.trim(), Description || "", Photos || null, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.affectedRows) return res.status(404).json({ error: "Event not found." });
    res.json({ message: "Event updated successfully." });
  });
});

// DELETE: remove an event
app.delete("/events/:id", (req, res) => {
  if (!databaseReady(res)) return;
  db.query("DELETE FROM event WHERE EventID=?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.affectedRows) return res.status(404).json({ error: "Event not found." });
    res.json({ message: "Event deleted successfully." });
  });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
