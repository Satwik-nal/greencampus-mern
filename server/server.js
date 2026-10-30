/*
  GreenCampus API — MERN server (Express + MongoDB).

  The React client never talks to MongoDB. The browser only calls these HTTP routes.
  This file: request → validate → MongoDB → JSON response.

  Start MongoDB first, then: npm install && npm start
  Keep this process running while you use the React app (port 5173).
*/
import "dotenv/config";
import cors from "cors";
import express from "express";
import { MongoClient } from "mongodb";

const app = express();
const PORT = Number(process.env.PORT || 3000);
const URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const DB_NAME = process.env.DB_NAME || "greencampus";
const ALLOWED = new Set(["waste", "water", "energy", "safety"]);

const SEED = [
  { id: 1, title: "Overflowing bins near Library", category: "waste", location: "West gate" },
  { id: 2, title: "Leaking tap in ISE block", category: "water", location: "2nd floor" },
  { id: 3, title: "Dark corridor, Mechanical block", category: "energy", location: "Ground floor" },
  { id: 4, title: "Broken step near cafeteria", category: "safety", location: "Cafeteria" },
];

// cors: allow the Vite app on another port to call this API.
app.use(cors());
// Turns JSON bodies from POST/PUT into req.body.
app.use(express.json());

const client = new MongoClient(URI);
let issues;

function toIssue(doc) {
  return { id: doc.id, title: doc.title, category: doc.category, location: doc.location };
}

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function nextId() {
  const last = await issues.find().sort({ id: -1 }).limit(1).next();
  return (last?.id ?? 0) + 1;
}

// Same field rules as Module 2 / 3 / 4. next() runs the route only if the body is clean.
function validateIssue(req, res, next) {
  const errors = [];
  const { title, category, location } = req.body ?? {};
  if (!title || String(title).trim().length < 5) {
    errors.push("title must be at least 5 characters");
  }
  if (!ALLOWED.has(category)) {
    errors.push("category must be waste, water, energy, or safety");
  }
  if (!location || String(location).trim().length < 2) {
    errors.push("location is required");
  }
  if (errors.length) {
    res.status(400).json({ errors });
    return;
  }
  next();
}

async function start() {
  await client.connect();
  issues = client.db(DB_NAME).collection("issues");

  // If the student skipped DML, the UI still has four cards to start with.
  if ((await issues.countDocuments()) === 0) {
    await issues.insertMany(SEED);
    console.log("Collection was empty. Inserted four seed issues.");
  }

  app.get("/", (req, res) => {
    res.json({
      app: "GreenCampus API",
      stack: "MERN",
      endpoints: [
        "GET /api/issues",
        "GET /api/issues/:id",
        "POST /api/issues",
        "PUT /api/issues/:id",
        "DELETE /api/issues/:id",
      ],
    });
  });

  // List — Issues page
  app.get("/api/issues", async (req, res) => {
    try {
      const rows = await issues.find({}).sort({ id: 1 }).toArray();
      res.json(rows.map(toIssue));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Database query failed", detail: err.message });
    }
  });

  app.get("/api/issues/:id", async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "id must be a positive integer" });
      return;
    }
    try {
      const doc = await issues.findOne({ id });
      if (!doc) {
        res.status(404).json({ error: "Issue not found" });
        return;
      }
      res.json(toIssue(doc));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Database query failed", detail: err.message });
    }
  });

  // Create — Report page
  app.post("/api/issues", validateIssue, async (req, res) => {
    const title = req.body.title.trim();
    const category = req.body.category;
    const location = req.body.location.trim();
    try {
      const id = await nextId();
      await issues.insertOne({ id, title, category, location });
      res.status(201).json({ id, title, category, location });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Insert failed", detail: err.message });
    }
  });

  // Update — Issues page (location field)
  app.put("/api/issues/:id", async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "id must be a positive integer" });
      return;
    }
    const { title, category, location } = req.body ?? {};
    if (category !== undefined && !ALLOWED.has(category)) {
      res.status(400).json({ errors: ["category must be waste, water, energy, or safety"] });
      return;
    }
    const $set = {};
    if (title !== undefined) $set.title = String(title).trim();
    if (category !== undefined) $set.category = category;
    if (location !== undefined) $set.location = String(location).trim();
    try {
      const result = await issues.findOneAndUpdate({ id }, { $set }, { returnDocument: "after" });
      if (!result) {
        res.status(404).json({ error: "Issue not found" });
        return;
      }
      res.json(toIssue(result));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Update failed", detail: err.message });
    }
  });

  // Delete — Issues page
  app.delete("/api/issues/:id", async (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
      res.status(400).json({ error: "id must be a positive integer" });
      return;
    }
    try {
      const result = await issues.deleteOne({ id });
      if (result.deletedCount === 0) {
        res.status(404).json({ error: "Issue not found" });
        return;
      }
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Delete failed", detail: err.message });
    }
  });

  app.listen(PORT, () => {
    console.log(`MERN API on http://localhost:${PORT}`);
    console.log("Leave this window open. Start the React client in another terminal.");
  });
}

start().catch((err) => {
  console.error("Could not start. Is mongod running?", err);
  process.exit(1);
});
