import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = 'qasim-dev';

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve frontend

// ======== ROUTES ========
// Search YouTube videos
app.get('/api/yts/searchAll', async (req,res)=>{
  const query = req.query.query;
  const response = await fetch(`https://api.qasimdev.dpdns.org/api/yts/searchAll?apiKey=${API_KEY}&query=${query}`);
  const data = await response.json();
  res.json(data);
});

// Spotify search
app.get('/api/spotify/search', async (req,res)=>{
  const query = req.query.q;
  const response = await fetch(`https://api.qasimdev.dpdns.org/api/spotify/search?q=${query}&apiKey=${API_KEY}`);
  const data = await response.json();
  res.json(data);
});

// MusicBrainz search
app.get('/api/musicbrainz/search', async (req,res)=>{
  const query = req.query.query;
  const response = await fetch(`https://api.qasimdev.dpdns.org/api/musicbrainz/search?query=${query}&apiKey=${API_KEY}`);
  const data = await response.json();
  res.json(data);
});

// Download route (audio/video)
app.get('/api/loaderto/download', async (req,res)=>{
  const { url, format } = req.query;
  const response = await fetch(`https://api.qasimdev.dpdns.org/api/loaderto/download?apiKey=${API_KEY}&url=${url}&format=${format}`);
  const data = await response.json();
  res.json(data);
});

app.listen(PORT, ()=> console.log(`StreamMe backend running on port ${PORT}`));