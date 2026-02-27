import { musicbrainzService } from "../services/musicbrainzService.js";

export const search = async (req, res) => {
  try {
    const { query } = req.query;
    const data = await musicbrainzService.search(query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const artist = async (req, res) => {
  try {
    const { artist_id } = req.query;
    const data = await musicbrainzService.artist(artist_id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const tracks = async (req, res) => {
  try {
    const { query } = req.query;
    const data = await musicbrainzService.tracks(query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const albums = async (req, res) => {
  try {
    const { query } = req.query;
    const data = await musicbrainzService.albums(query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
