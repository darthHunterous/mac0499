const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const https = require("https");
const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const cheerio = require("cheerio");
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
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const secretId = process.env.SPOTIFY_CLIENT_SECRET;

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
  res.render("spotify/track", { data: app.get("trackData") });
});

app.post("/spotify/track", async (req, res) => {
  try {
    const response = await axios({
      method: "get",
      url: "https://api.spotify.com/v1/search",
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
      params: {
        q: req.body.trackName,
        type: "track",
      },
      json: true,
    });

    const tracks = response.data.tracks.items;
    const result = tracks.map(({ id, name, artists }) => ({
      id,
      name,
      artists,
    }));

    app.set("trackData", result);
  } catch (error) {
    console.log(error);
  }

  res.redirect("/spotify/track");
});

app.get("/spotify/track/:id", (req, res) => {
  const { id } = req.params;
  res.render("spotify/trackWidget.ejs", { id });
});

app.get("/spotify/album", (req, res) => {
  res.render("spotify/album", { data: app.get("albumData") });
});

app.post("/spotify/album", async (req, res) => {
  try {
    const response = await axios({
      method: "get",
      url: "https://api.spotify.com/v1/search",
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
      params: {
        q: req.body.albumName,
        type: "album",
      },
      json: true,
    });

    const albums = response.data.albums.items;
    const result = albums.map(({ id, name, artists }) => ({
      id,
      name,
      artists,
    }));

    app.set("albumData", result);
  } catch (error) {
    console.log(error);
  }

  res.redirect("/spotify/album");
});

app.get("/spotify/album/:id", (req, res) => {
  const { id } = req.params;
  res.render("spotify/albumWidget.ejs", { id });
});

app.get("/spotify/sdk", (req, res) => {
  res.render("spotify/sdk.ejs");
});

app.get("/spotify/sdk/activated", (req, res) => {
  const { token } = req.query;

  res.render("spotify/sdkActivated", { token });
});

app.get("/youtube", (req, res) => {
  res.render("youtube/search", { data: app.get("youtubeData") });
});

app.post("/youtube", async (req, res) => {
  try {
    const youtubeKey = process.env.YOUTUBE_KEY;

    const response = await axios({
      method: "get",
      url: "https://www.googleapis.com/youtube/v3/search",
      params: {
        q: req.body.trackName,
        key: youtubeKey,
        part: "snippet",
        maxResults: 10,
        type: "video",
      },
      json: true,
    });

    const videos = response.data.items;

    const result = videos.map(({ id, snippet }) => ({
      videoId: id.videoId,
      title: snippet.title,
    }));

    app.set("youtubeData", result);
  } catch (error) {
    console.log(error);
  }

  res.redirect("/youtube");
});

app.get("/youtube/video/:id", (req, res) => {
  const { id } = req.params;
  res.render("youtube/video", { id });
});

app.get("/soundcloud", (req, res) => {
  res.render("soundcloud/search", { data: app.get("soundcloudData") });
});

app.post("/soundcloud", async (req, res) => {
  try {
    const response = await axios({
      method: "get",
      url: "https://soundcloud.com/search/sounds",
      params: {
        q: req.body.trackName,
      },
    });

    const dom = new JSDOM(response.data);

    const songElements = dom.window.document.querySelectorAll(
      "noscript ul li h2 a"
    );

    const data = [];
    for (let element of songElements) {
      const title = element.textContent;
      const href = element.href;

      data.push({ title, href });
    }

    app.set("soundcloudData", data);
  } catch (error) {
    console.log(error);
  }

  res.redirect("/soundcloud");
});

app.get("/soundcloud/:artist/:song", (req, res) => {
  const { artist, song } = req.params;
  res.render("soundcloud/widget", { artist, song });
});
