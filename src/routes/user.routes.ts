import express from "express";
import { userValidation } from "../validation/user.validation";
import { validateApi } from "../middlewares/validate.middleware";
import { addUser } from "../controllers/user.controller";

const userRoutes = express.Router();
userRoutes.post("/register", userValidation(), validateApi, addUser);
export default userRoutes;
