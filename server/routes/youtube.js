import express from "express";
import { searchPlay, getVideo, downloadVideo } from "../controllers/youtubeController.js";

const router = express.Router();

// Search YouTube videos/playlists
router.get("/play", searchPlay);       // ?query=...
router.get("/video", getVideo);        // ?query=...
router.get("/download", downloadVideo);// ?url=...&format=...

export default router;
