import mongoose, { Types, Document, Schema } from "mongoose";

export interface LoginDocument extends Document {
  _id: string;
  userId: Types.ObjectId;
  email: string;
  token: string;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const loginSchema = new Schema<LoginDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Login = mongoose.model<LoginDocument>("Login", loginSchema);
