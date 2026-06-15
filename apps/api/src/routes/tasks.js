import express from "express";
import { createTask, deleteTask, listTasks, updateTask } from "../services/taskService.js";
import { TaskValidationError } from "../services/taskValidation.js";

export const tasksRouter = express.Router();

function handleTaskError(error, res, next) {
  if (error instanceof TaskValidationError) {
    res.status(400).json({ error: error.message });
    return;
  }

  next(error);
}

tasksRouter.get("/", (req, res) => {
  res.json({ tasks: listTasks({ status: req.query.status, class: req.query.class }) });
});

tasksRouter.post("/", (req, res, next) => {
  try {
    res.status(201).json({ task: createTask(req.body) });
  } catch (error) {
    handleTaskError(error, res, next);
  }
});

tasksRouter.patch("/:id", (req, res, next) => {
  try {
    const task = updateTask(req.params.id, req.body || {});
    if (!task) {
      res.status(404).json({ error: "Task not found." });
      return;
    }

    res.json({ task });
  } catch (error) {
    handleTaskError(error, res, next);
  }
});

tasksRouter.delete("/:id", (req, res) => {
  if (!deleteTask(req.params.id)) {
    res.status(404).json({ error: "Task not found." });
    return;
  }

  res.status(204).end();
});
