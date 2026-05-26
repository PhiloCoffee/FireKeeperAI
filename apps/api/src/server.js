import "dotenv/config";
import cors from "cors";
import express from "express";
import { dbPath } from "./db/database.js";
import { chatRouter } from "./routes/chat.js";
import { exportRouter } from "./routes/export.js";
import { tasksRouter } from "./routes/tasks.js";

const app = express();
const port = Number(process.env.PORT || 8787);
const webOrigin = process.env.WEB_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: webOrigin }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    dbPath,
    claudeConfigured: Boolean(process.env.ANTHROPIC_API_KEY)
  });
});

app.use("/api/tasks", tasksRouter);
app.use("/api/chat", chatRouter);
app.use("/api/export", exportRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(port, () => {
  console.log(`Fire Keeper API listening on http://localhost:${port}`);
});
