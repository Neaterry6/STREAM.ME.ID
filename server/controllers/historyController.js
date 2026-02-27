import fs from "fs-extra";
const HISTORY_FILE = "./server/db/history.json";

// Get user history
export const getHistory = async (req, res) => {
  try {
    const data = await fs.readJson(HISTORY_FILE).catch(() => []);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new search/download
export const addHistory = async (req, res) => {
  try {
    const record = req.body;
    const data = await fs.readJson(HISTORY_FILE).catch(() => []);
    data.push({ ...record, timestamp: new Date().toISOString() });
    await fs.writeJson(HISTORY_FILE, data, { spaces: 2 });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
