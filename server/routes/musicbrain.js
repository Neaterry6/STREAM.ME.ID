import express from "express";
import { search, artist, tracks, albums } from "../controllers/musicbrainzController.js";
const router = express.Router();

router.get("/search", search);        // ?query=
router.get("/artist", artist);        // ?artist_id=
router.get("/tracks", tracks);        // ?query=
router.get("/albums", albums);        // ?query=

export default router;
