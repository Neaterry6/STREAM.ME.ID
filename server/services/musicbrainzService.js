import axios from "axios";
const BASE_URL = "https://api.qasimdev.dpdns.org/api/musicbrainz";
const API_KEY = process.env.QASIM_API_KEY;

export const musicbrainzService = {
  search: async (query) => {
    const res = await axios.get(`${BASE_URL}/search?query=${encodeURIComponent(query)}&apiKey=${API_KEY}`);
    return res.data;
  },
  artist: async (id) => {
    const res = await axios.get(`${BASE_URL}/artist?artist_id=${id}&apiKey=${API_KEY}`);
    return res.data;
  },
  tracks: async (query) => {
    const res = await axios.get(`${BASE_URL}/tracks?query=${encodeURIComponent(query)}&apiKey=${API_KEY}`);
    return res.data;
  },
  albums: async (query) => {
    const res = await axios.get(`${BASE_URL}/albums?query=${encodeURIComponent(query)}&apiKey=${API_KEY}`);
    return res.data;
  }
};
