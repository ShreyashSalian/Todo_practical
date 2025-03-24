import express from "express";
import { Todos } from "../models/todos.model";
import { asyncHandler } from "../utils/fuctionList";
import { User } from "../models/user.model";
import mongoose, { now } from "mongoose";
import { sendEmailReminder } from "../utils/email.service";
import cron from "node-cron";
export const createTodos = asyncHandler(
  async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response> => {
    const {
      title,
      description,
      dueDate,
    }: { title: string; description: string; dueDate: Date } = req.body;
    const todosCreation = await Todos.create({
      title,
      description,
      dueDate,
      createdFor: req.user?.userId,
    });
    if (todosCreation) {
      return res.status(201).json({
        status: 200,
        message: "Todo created successfully",
        data: todosCreation,
        error: null,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: null,
        data: null,
        error: "Sorry, todo cant be created",
      });
    }
  }
);

export const getTodosByDate = asyncHandler(
  async (
    req: express.Request<{}, {}, { date: Date }>,
    res: express.Response
  ): Promise<express.Response> => {
    try {
      const { date } = req.body; // Expecting 'YYYY-MM-DD'
      if (!date) {
        return res.status(400).json({
          status: 400,
          message: null,
          data: null,
          error: "Please enter the date in the form of YYYY-MM-DD",
        });
      }

      const user = req.user?.userId;
      if (!user) {
        return res.status(401).json({
          status: 401,
          message: null,
          data: null,
          error: "Unauthorized request.",
        });
      }

      // Convert input date to start and end of the day
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Fetch todos using aggregation
      const todos = await Todos.aggregate([
        {
          $match: {
            createdFor: new mongoose.Types.ObjectId(user),
            dueDate: { $gte: startOfDay, $lt: endOfDay },
          },
        },
      ]);

      if (!todos.length) {
        return res.status(404).json({
          status: 404,
          message: null,
          data: null,
          error: "No todos found for the given date.",
        });
      }

      return res.status(200).json({
        status: 200,
        message: "Todos list for the given date",
        data: todos,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching todos by date:", error);
      return res.status(500).json({
        status: 500,
        message: null,
        data: null,
        error: "Internal server error.",
      });
    }
  }
);

export const updateTodosDetails = asyncHandler(
  async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ): Promise<express.Response> => {
    const { id } = req.params;
    const {
      title,
      description,
      dueDate,
    }: { title: string; description: string; dueDate: Date } = req.body;
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        status: 401,
        message: null,
        data: null,
        error: "User is not allowed.",
      });
    }
    const updateTheTodosDetails = await Todos.findByIdAndUpdate(
      id,
      {
        $set: {
          title: title,
          description: description,
          dueDate: dueDate,
        },
      },
      { new: true }
    );
    if (updateTheTodosDetails) {
      return res.status(200).json({
        status: 200,
        message: "To-Do updated successfully!",
        data: updateTheTodosDetails,
        error: null,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: null,
        data: null,
        error: "Todos can not be updated",
      });
    }
  }
);

export const deleteTodos = asyncHandler(
  async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ): Promise<express.Response> => {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        status: 401,
        message: null,
        data: null,
        error: "Unauthorized request.",
      });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todo = await Todos.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      createdFor: new mongoose.Types.ObjectId(userId),
      dueDate: { $gte: todayStart, $lt: todayEnd },
    });
    if (!todo) {
      return res.status(404).json({
        status: 404,
        message: null,
        data: null,
        error: "No To-Do found for today or not authorized.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "To-Do deleted successfully!",
      data: null,
      error: null,
    });
  }
);

export const updateTodosStatus = asyncHandler(
  async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ): Promise<express.Response> => {
    const { id } = req.params;

    const updateTodosStatus = await Todos.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "completed",
        },
      },
      {
        new: true,
      }
    );
    if (updateTodosStatus) {
      return res.status(200).json({
        status: 200,
        message: "To-Do marked as completed!",
        data: updateTodosStatus,
        error: null,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: null,
        data: null,
        error: "Todo can not be updated",
      });
    }
  }
);

export const updateTodosStatusToPending = asyncHandler(
  async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ): Promise<express.Response> => {
    const { id } = req.params;
    const updateTodosStatus = await Todos.findByIdAndUpdate(
      id,
      {
        $set: {
          status: "pending",
        },
      },
      {
        new: true,
      }
    );
    if (updateTodosStatus) {
      return res.status(200).json({
        status: 200,
        message: "To-Do marked as completed!",
        data: updateTodosStatus,
        error: null,
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: null,
        data: null,
        error: "Todo can not be updated",
      });
    }
  }
);

export const sendReminder = asyncHandler(
  async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ): Promise<express.Response> => {
    const { id } = req.params;
    const { reminderTime }: { reminderTime: Date } = req.body;
    if (!id || !reminderTime) {
      return res
        .status(400)
        .json({ error: "Todo ID and Reminder Time are required." });
    }
    const updateReminderOfTodos = await Todos.findByIdAndUpdate(
      id,
      {
        $set: {
          remiderTime: new Date(reminderTime),
        },
      },
      {
        new: true,
      }
    );
    if (updateReminderOfTodos) {
      return res.status(200).json({
        message: "Reminder set successfully.",
        data: updateReminderOfTodos,
        error: null,
        status: 200,
      });
    } else {
      return res.status(500).json({
        error: "Reminder not set.",
        data: null,
        message: null,
        status: 500,
      });
    }
  }
);

const sendReminders = async () => {
  try {
    const now = new Date();

    // Find tasks where reminderTime is within the last 1 minute
    const reminders = await Todos.find({
      reminderTime: { $gte: new Date(now.getTime() - 60000), $lt: now },
      status: "pending",
    }).populate("createdFor", "email"); // Populate user email

    for (const todo of reminders) {
    }
  } catch (error) {
    console.error("Error sending reminders:", error);
  }
};

// Schedule job to run every minute
cron.schedule("* * * * *", async () => {
  console.log(" Checking for tasks with reminder times...");
  await sendReminders();
});
