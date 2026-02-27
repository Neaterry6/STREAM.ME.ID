import axios from "axios";
const BASE_URL = "https://api.qasimdev.dpdns.org/api/youtube";
const API_KEY = process.env.QASIM_API_KEY;

export const youtubeService = {
  searchPlay: async (query) => {
    const res = await axios.get(`${BASE_URL}/play?apiKey=${API_KEY}&query=${encodeURIComponent(query)}`);
    return res.data;
  },
  getVideo: async (query) => {
    const res = await axios.get(`${BASE_URL}/video?apiKey=${API_KEY}&query=${encodeURIComponent(query)}`);
    return res.data;
  },
  downloadVideo: async (url, format) => {
    const res = await axios.get(`${BASE_URL}/download?apiKey=${API_KEY}&url=${encodeURIComponent(url)}&format=${format}`);
    return res.data;
  }
};
