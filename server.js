
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // put your index.html here

const API_KEY = 'qasim-dev';
const HISTORY_FILE = './history.json';

// Utils
function saveHistory(entry) {
  let history = fs.existsSync(HISTORY_FILE) ? JSON.parse(fs.readFileSync(HISTORY_FILE)) : [];
  history.unshift(entry);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(0, 50), null, 2));
}

async function proxyAPI(baseUrl, endpointName, req, res) {
  try {
    const url = `\( {baseUrl}&apiKey= \){API_KEY}`;
    const data = await (await fetch(url)).json();
    saveHistory({ endpoint: endpointName, query: req.originalUrl, timestamp: new Date().toISOString() });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: `${endpointName} failed` });
  }
}

// === YOUTUBE ===
app.get('/api/yts/searchAll', (req, res) => proxyAPI(`https://api.qasimdev.dpdns.org/api/yts/searchAll?query=${req.query.q}`, 'YT SearchAll', req, res));
app.get('/api/yts/getVideo', (req, res) => proxyAPI(`https://api.qasimdev.dpdns.org/api/yts/getVideo?id=${req.query.id}`, 'YT GetVideo', req, res));
app.get('/api/yts/searchPlaylists', (req, res) => proxyAPI(`https://api.qasimdev.dpdns.org/api/yts/searchPlaylists?query=${req.query.q}`, 'YT Playlists', req, res));

// === SPOTIFY ===
app.get('/api/spotify/search', (req, res) => proxyAPI(`https://api.qasimdev.dpdns.org/api/spotify/search?q=${req.query.q}`, 'Spotify Search', req, res));
app.get('/api/spotify/trackInfo', (req, res) => proxyAPI(`https://api.qasimdev.dpdns.org/api/spotify/trackInfo?url=${req.query.url}`, 'Spotify TrackInfo', req, res));
app.get('/api/spotify/download', (req, res) => proxyAPI(`https://api.qasimdev.dpdns.org/api/spotify/download?url=${req.query.url}`, 'Spotify Download', req, res));

// === MUSICBRAINZ ===
app.get('/api/musicbrainz/search', (req, res) => proxyAPI(`https://api.qasimdev.dpdns.org/api/musicbrainz/search?query=${req.query.query || req.query.q}`, 'MB Search', req, res));
app.get('/api/musicbrainz/artists', (req, res) => proxyAPI(`https://api.qasimdev.dpdns.org/api/musicbrainz/artists?query=${req.query.q}`, 'MB Artists', req, res));
app.get('/api/musicbrainz/albums', (req, res) => proxyAPI(`https://api.qasimdev.dpdns.org/api/musicbrainz/albums?query=${req.query.q}`, 'MB Albums', req, res));
app.get('/api/musicbrainz/tracks', (req, res) => proxyAPI(`https://api.qasimdev.dpdns.org/api/musicbrainz/tracks?query=${req.query.q}`, 'MB Tracks', req, res));
app.get('/api/musicbrainz/artist', (req, res) => proxyAPI(`https://api.qasimdev.dpdns.org/api/musicbrainz/artist?artist_id=${req.query.artist_id}`, 'MB Artist', req, res));

// === DOWNLOAD ===
app.get('/api/loaderto/download', (req, res) => proxyAPI(`https://api.qasimdev.dpdns.org/api/loaderto/download?url=\( {req.query.url}&format= \){req.query.format || 'mp3'}`, 'Loader Download', req, res));

// History
app.get('/api/history', (req, res) => {
  const history = fs.existsSync(HISTORY_FILE) ? JSON.parse(fs.readFileSync(HISTORY_FILE)) : [];
  res.json(history);
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));