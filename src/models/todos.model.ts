import mongoose, { Document, Schema, Types } from "mongoose";

export interface TaskDocument extends Document {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdFor: Types.ObjectId;
  dueDate: Date;
  isDeleted: Boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum Status {
  PENDING = "pending",
  INPROGRESS = "in-progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  MISSED = "missed",
}

export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRICTICAL = "crictical",
}

const todoSchema = new Schema<TaskDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(Status), // Validate against the enum values
      default: Status.PENDING, // Set a default role
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Todos = mongoose.model<TaskDocument>("Todos", todoSchema);
