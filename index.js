const express = require("express");
const path = require("path");

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
    res.sendFile(path.join(__dirname, "not-installed.html"));
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
    res.sendFile(path.join(__dirname, "not-installed.html"));
    // res.redirect("https://chipin.com/home");
    // Redirect to a web fallback for non-Android devices
    // res.redirect(`https://chipin.com/${screen}?referral=${referralCode}`);
  }
});

// Serve the fallback page if app is not installed
app.get("/not-installed", (req, res) => {
  res.sendFile(path.join(__dirname, "not-installed.html"));
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});


// const express = require("express");
// const path = require("path");

// const app = express();
// const PORT = 3000;

// // To check/ensure assetlinks.json file is live
// app.get("/.well-known/assetlinks.json", (req, res) => {
//   res.sendFile(path.join(__dirname, "assetlinks.json"));
// });

// // Serve the web page if app is not installed
// app.get("/", (req, res) => {
//   // Check for the `user-agent` header for Android deep linking
//   const userAgent = req.headers["user-agent"] || "";

//   if (userAgent.includes("Android")) {
//     res.redirect("intent://chipin#Intent;scheme=chipinapp;package=com.chipin;end");
//   } else {
//     // res.sendFile(path.join(__dirname, "not-installed.html"));
//     res.redirect("https://chipin.com/home");
//   }
// });

// // Serve the fallback page if app is not installed
// app.get("/not-installed", (req, res) => {
//   res.sendFile(path.join(__dirname, "not-installed.html"));
// });

// app.listen(PORT, () => {
//   console.log(`Backend running on http://localhost:${PORT}`);
// });
