const express = require("express");
const path = require("path");
const { Server } = require("http");
const fs = require("fs");
// Unique ID NPM Package
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

//html routes for json
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

//API route for db.json
app.get("/api/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./db/db.json"))
);

// get notes for id
app.get("/api/notes/:id", (req, res) =>
  res.sendFile(path.join(__dirname, "./db/db.json"))
);

//wild card route to landing page
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// post to request add notes
app.post("/api/notes", (req, res) => {
  const newSavedNote = req.body;
  console.log(newSavedNote);
  newSavedNote.id = uuidv4();
  const notes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./db/db.json"))
  );
  console.log(notes);
  notes.push(newSavedNote);
  console.log(notes);
  fs.writeFile("./db/db.json", JSON.stringify(notes), function (err, result) {
    if (err) console.log("error", err);
  });
  return res.json({});
});

//delete note
app.delete("/api/notes/:id", (req, res) => {
  const notes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "./db/db.json"))
  );
  console.log(`delete ${req.params.id}`);
  let idNote = `${req.params.id}`;
  let deleteNote = notes.findIndex((notes) => notes.id === idNote);
  console.log(deleteNote);
  notes.splice(deleteNote, 1);
  fs.writeFile("./db/db.json", JSON.stringify(notes), function (err, result) {
    if (err) console.log("error", err);
  });
  return res.json({});
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});