import express from "express";
import { createTask, deleteTask, listTasks, updateTask } from "../services/taskService.js";

export const tasksRouter = express.Router();

tasksRouter.get("/", (req, res) => {
  res.json({ tasks: listTasks({ status: req.query.status, class: req.query.class }) });
});

tasksRouter.post("/", (req, res) => {
  if (!String(req.body?.title || "").trim()) {
    res.status(400).json({ error: "Task title is required." });
    return;
  }

  res.status(201).json({ task: createTask(req.body) });
});

tasksRouter.patch("/:id", (req, res) => {
  const task = updateTask(req.params.id, req.body || {});
  if (!task) {
    res.status(404).json({ error: "Task not found." });
    return;
  }

  res.json({ task });
});

tasksRouter.delete("/:id", (req, res) => {
  if (!deleteTask(req.params.id)) {
    res.status(404).json({ error: "Task not found." });
    return;
  }

  res.status(204).end();
});
