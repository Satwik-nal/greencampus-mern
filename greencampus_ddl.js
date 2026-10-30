// GreenCampus — create the MongoDB database and issues collection.
// Run from this MERN folder: mongosh --file greencampus_ddl.js

const dbName = "greencampus";
db = db.getSiblingDB(dbName);

db.issues.drop();
db.createCollection("issues");

// Numeric `id` is what GET /api/issues/1 uses (easier than MongoDB _id in the UI).
db.issues.createIndex({ id: 1 }, { unique: true });
db.issues.createIndex({ category: 1 });

print("DDL done: database '" + dbName + "', collection 'issues'.");
