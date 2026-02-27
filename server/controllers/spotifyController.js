import { spotifyService } from "../services/spotifyService.js";

export const searchSpotify = async (req, res) => {
  try {
    const { q } = req.query;
    const data = await spotifyService.search(q);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const downloadSpotify = async (req, res) => {
  try {
    const { url } = req.query;
    const data = await spotifyService.download(url);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const trackInfo = async (req, res) => {
  try {
    const { url } = req.query;
    const data = await spotifyService.trackInfo(url);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
