import { youtubeService } from "../services/youtubeService.js";

// Search for songs/playlists
export const searchPlay = async (req, res) => {
  try {
    const { query } = req.query;
    const data = await youtubeService.searchPlay(query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVideo = async (req, res) => {
  try {
    const { id } = req.query;
    const data = await youtubeService.getVideo(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const downloadVideo = async (req, res) => {
  try {
    const { url, format } = req.query;
    const data = await youtubeService.downloadVideo(url, format);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
