import express from "express";
import { getHistory, addHistory } from "../controllers/historyController.js";
const router = express.Router();

// Store or get user search/download history
router.get("/", getHistory);
router.post("/", addHistory);

export default router;
