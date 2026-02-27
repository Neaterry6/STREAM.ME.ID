import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";

// Routes
import youtubeRoutes from "./routes/youtube.js";
import spotifyRoutes from "./routes/spotify.js";
import musicbrainzRoutes from "./routes/musicbrainz.js";
import historyRoutes from "./routes/history.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API Routes
app.use("/api/youtube", youtubeRoutes);
app.use("/api/spotify", spotifyRoutes);
app.use("/api/musicbrainz", musicbrainzRoutes);
app.use("/api/history", historyRoutes);

// Serve frontend
app.use(express.static(path.join(process.cwd(), "public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
