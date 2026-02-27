import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const API_KEY = 'qasim-dev';
const HISTORY_FILE = path.join(process.cwd(), 'history.json');

function saveHistory(entry) {
  let history = fs.existsSync(HISTORY_FILE) ? JSON.parse(fs.readFileSync(HISTORY_FILE)) : [];
  history.unshift(entry);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(0, 50), null, 2));
}

async function proxy(url, name, req, res) {
  try {
    const data = await (await fetch(url)).json();
    saveHistory({ endpoint: name, query: req.originalUrl, timestamp: new Date().toISOString() });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: `${name} failed` });
  }
}

// YouTube
app.get('/api/yts/searchAll', (req, res) => proxy(`https://api.qasimdev.dpdns.org/api/yts/searchAll?apiKey=\( {API_KEY}&query= \){req.query.q||''}`, 'YT searchAll', req, res));
app.get('/api/yts/getVideo', (req, res) => proxy(`https://api.qasimdev.dpdns.org/api/yts/getVideo?apiKey=\( {API_KEY}&id= \){req.query.id||''}`, 'YT getVideo', req, res));
app.get('/api/yts/searchPlaylists', (req, res) => proxy(`https://api.qasimdev.dpdns.org/api/yts/searchPlaylists?apiKey=\( {API_KEY}&query= \){req.query.q||''}`, 'YT playlists', req, res));

// Spotify
app.get('/api/spotify/search', (req, res) => proxy(`https://api.qasimdev.dpdns.org/api/spotify/search?apiKey=\( {API_KEY}&q= \){req.query.q||''}`, 'Spotify search', req, res));
app.get('/api/spotify/trackInfo', (req, res) => proxy(`https://api.qasimdev.dpdns.org/api/spotify/trackInfo?apiKey=\( {API_KEY}&url= \){encodeURIComponent(req.query.url||'')}`, 'Spotify trackInfo', req, res));
app.get('/api/spotify/download', (req, res) => proxy(`https://api.qasimdev.dpdns.org/api/spotify/download?apiKey=\( {API_KEY}&url= \){encodeURIComponent(req.query.url||'')}`, 'Spotify download', req, res));

// MusicBrainz (trending, albums, songs, artist details)
app.get('/api/musicbrainz/search', (req, res) => proxy(`https://api.qasimdev.dpdns.org/api/musicbrainz/search?apiKey=\( {API_KEY}&query= \){req.query.query||req.query.q||''}`, 'MB search', req, res));
app.get('/api/musicbrainz/artists', (req, res) => proxy(`https://api.qasimdev.dpdns.org/api/musicbrainz/artists?apiKey=\( {API_KEY}&query= \){req.query.q||''}`, 'MB artists', req, res));
app.get('/api/musicbrainz/albums', (req, res) => proxy(`https://api.qasimdev.dpdns.org/api/musicbrainz/albums?apiKey=\( {API_KEY}&query= \){req.query.q||''}`, 'MB albums (trending)', req, res));
app.get('/api/musicbrainz/tracks', (req, res) => proxy(`https://api.qasimdev.dpdns.org/api/musicbrainz/tracks?apiKey=\( {API_KEY}&query= \){req.query.q||''}`, 'MB tracks', req, res));
app.get('/api/musicbrainz/artist', (req, res) => proxy(`https://api.qasimdev.dpdns.org/api/musicbrainz/artist?apiKey=\( {API_KEY}&artist_id= \){req.query.artist_id||''}`, 'MB artist details', req, res));

// Loader.to download
app.get('/api/loaderto/download', (req, res) => proxy(`https://api.qasimdev.dpdns.org/api/loaderto/download?apiKey=\( {API_KEY}&url= \){encodeURIComponent(req.query.url||'')}&format=${req.query.format||'mp3'}`, 'Loader download', req, res));

// History
app.get('/api/history', (req, res) => {
  const history = fs.existsSync(HISTORY_FILE) ? JSON.parse(fs.readFileSync(HISTORY_FILE)) : [];
  res.json(history);
});

app.listen(PORT, () => console.log(`✅ Server running → http://localhost:${PORT}`));