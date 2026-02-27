import axios from "axios";
const BASE_URL = "https://api.qasimdev.dpdns.org/api/spotify";
const API_KEY = process.env.QASIM_API_KEY;

export const spotifyService = {
  search: async (q) => {
    const res = await axios.get(`${BASE_URL}/search?q=${encodeURIComponent(q)}&apiKey=${API_KEY}`);
    return res.data;
  },
  download: async (url) => {
    const res = await axios.get(`${BASE_URL}/download?url=${encodeURIComponent(url)}&apiKey=${API_KEY}`);
    return res.data;
  },
  trackInfo: async (url) => {
    const res = await axios.get(`${BASE_URL}/trackInfo?url=${encodeURIComponent(url)}&apiKey=${API_KEY}`);
    return res.data;
  }
};
