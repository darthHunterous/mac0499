const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const https = require("https");
const axios = require("axios");
// const request = require("request");
const { encode } = require("punycode");

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));

require("dotenv").config();

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

app.get("/", (req, res) => {
  res.render("home");
});

function encodeAuth64() {
  const clientId = process.env.CLIENT_ID;
  const secretId = process.env.CLIENT_SECRET;

  const authUnencoded = `${clientId}:${secretId}`;
  const authBase64 = Buffer.from(authUnencoded).toString("base64");

  return authBase64;
}

async function getSpotifyToken() {
  try {
    const response = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization: `Basic ${encodeAuth64()}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        grant_type: "client_credentials",
      },
      json: true,
    });
    return response.data.access_token;
  } catch (error) {
    console.log(error);
  }
}

let spotifyToken = null;
app.get("/spotify", async (req, res) => {
  if (!spotifyToken) {
    spotifyToken = await getSpotifyToken();
  }

  res.render("spotify/index");
});

app.get("/spotify/track", (req, res) => {
  res.render("spotify/track");
});

app.post("/spotify/track", (req, res) => {
  console.log(req.body.trackName);
});
