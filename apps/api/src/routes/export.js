import express from "express";
import { normalizeLanguage } from "../services/i18nService.js";
import { writeMarkdownExport } from "../services/exportService.js";

export const exportRouter = express.Router();

exportRouter.get("/markdown", (req, res) => {
  const result = writeMarkdownExport(normalizeLanguage(req.query.language));
  res.json(result);
});
