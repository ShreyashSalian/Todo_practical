import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression";
import cluster from "cluster";
import os from "os";

import cookieParser from "cookie-parser";
import path from "path";
import connectDB from "./database/connect";
import indexRoutes from "./routes/index.routes";
import { swaggersDocuments } from "./utils/swagger";
import swaggerUI from "swagger-ui-express";
dotenv.config();

const app = express();
const port: string | number = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(path.resolve(), "public")));
app.use("images", express.static("public/images"));
app.use(cookieParser());
app.use(compression());
app.set("view engine", "hbs");
app.set("views", "./src/views");

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`The app is running at : http://localhost:${port}`);
    });
  })
  .catch(() => {
    console.log("Error while connection to the database");
  });

app.use(indexRoutes);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggersDocuments));
