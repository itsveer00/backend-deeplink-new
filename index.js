const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// To check/ensure assetlinks.json file is live
app.get("/.well-known/assetlinks.json", (req, res) => {
  res.sendFile(path.join(__dirname, "assetlinks.json"));
});

// Open specific screen path and referral code
app.get("/:screen/:referralCode", (req, res) => {
  const { screen, referralCode } = req.params;

  // Check for the `user-agent` header for Android deep linking
  const userAgent = req.headers["user-agent"] || "";

  if (userAgent.includes("Android")) {
    // Redirect to app with the screen path and referral code
    res.redirect(
      `intent://chipin/${screen}?referral=${referralCode}#Intent;scheme=chipinapp;package=com.chipin;end`
    );
  } else {
    // Serve a web fallback if the app is not installed
    // res.redirect(`https://chipin.com/${screen}?referral=${referralCode}`);
    // res.sendFile(path.join(__dirname, "not-installed.html"));
    sendNotInstalledHtml(res, referralCode, req);
  }
});

// Open the web page if app is not installed
app.get("/", (req, res) => {
  // Check for the `user-agent` header for Android deep linking
  const userAgent = req.headers["user-agent"] || "";

  if (userAgent.includes("Android")) {
    // res.redirect("intent://chipin#Intent;scheme=chipinapp;package=com.chipin;end");
    res.sendFile(path.join(__dirname, "not-installed.html"));
  } else {
    sendNotInstalledHtml(res, "N/A", req); // Default referral code if none provided
    // res.sendFile(path.join(__dirname, "not-installed.html"));
    // res.redirect(`https://chipin.com/${screen}?referral=${referralCode}`);
  }
});

// Function to dynamically inject the referral url into the HTML
function sendNotInstalledHtml(res, referralCode, req) {
  const filePath = path.join(__dirname, "not-installed.html");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the HTML file:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Construct the full referral URL
    const fullReferralUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
    
    // Replace placeholder with full referral URL
    const modifiedHtml = data.replace("{}", fullReferralUrl);
    res.send(modifiedHtml);
  });
}

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});