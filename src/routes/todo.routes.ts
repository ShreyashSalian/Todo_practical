import express from "express";
import { todoValidation } from "../validation/todo.validation";
import { validateApi } from "../middlewares/validate.middleware";
import { verifyUser } from "../middlewares/auth.middleware";
import {
  createTodos,
  deleteTodos,
  getTodosByDate,
  sendReminder,
  updateTodosDetails,
  updateTodosStatus,
  updateTodosStatusToPending,
} from "../controllers/todos.controller";

const todoRoutes = express.Router();
todoRoutes.post("/", verifyUser, todoValidation(), validateApi, createTodos);
todoRoutes.post("/todos-by-date", verifyUser, getTodosByDate);
todoRoutes.put("/:id", verifyUser, updateTodosDetails);
todoRoutes.post("/update-todo-to-complete/:id", verifyUser, updateTodosStatus);
todoRoutes.post(
  "/update-todo-to-pending/:id",
  verifyUser,
  updateTodosStatusToPending
);
todoRoutes.delete("/:id", verifyUser, deleteTodos);
todoRoutes.post("/update-todo-to-complete/:id", verifyUser, updateTodosStatus);
todoRoutes.post(
  "/update-todo-to-pending/:id",
  verifyUser,
  updateTodosStatusToPending
);
todoRoutes.delete("/:id", verifyUser, deleteTodos);
todoRoutes.post("/send-reminder", verifyUser, sendReminder);

export default todoRoutes;
