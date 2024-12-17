const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.get("/.well-known/assetlinks.json", (req, res) => {
  res.sendFile(path.join(__dirname, "assetlinks.json"));
});

// Serve the web page if app is not installed
app.get("/", (req, res) => {
  // Check for the `user-agent` header for Android deep linking
  const userAgent = req.headers["user-agent"] || "";

  if (userAgent.includes("Android")) {
    res.redirect("intent://chipin#Intent;scheme=chipinapp;package=com.chipin;end");
  } else {
    res.sendFile(path.join(__dirname, "not-installed.html"));
  }
});

// Serve the fallback page if app is not installed
app.get("/not-installed", (req, res) => {
  res.sendFile(path.join(__dirname, "not-installed.html"));
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
