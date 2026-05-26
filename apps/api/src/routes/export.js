import express from "express";
import { writeMarkdownExport } from "../services/exportService.js";

export const exportRouter = express.Router();

exportRouter.get("/markdown", (_req, res) => {
  const result = writeMarkdownExport();
  res.json(result);
});
