// GreenCampus — insert the four seed issues (same data as Modules 2–4).
// Run AFTER greencampus_ddl.js: mongosh --file greencampus_dml.js

const dbName = "greencampus";
db = db.getSiblingDB(dbName);

db.issues.deleteMany({});

db.issues.insertMany([
  { id: 1, title: "Overflowing bins near Library", category: "waste", location: "West gate" },
  { id: 2, title: "Leaking tap in ISE block", category: "water", location: "2nd floor" },
  { id: 3, title: "Dark corridor, Mechanical block", category: "energy", location: "Ground floor" },
  { id: 4, title: "Broken step near cafeteria", category: "safety", location: "Cafeteria" },
]);

print("DML done: inserted " + db.issues.countDocuments() + " issues.");
printjson(
  db.issues.find({}, { _id: 0, id: 1, title: 1, category: 1, location: 1 }).sort({ id: 1 }).toArray(),
);
