import express from "express";
import { loginValidation } from "../validation/login.validation";
import { validateApi } from "../middlewares/validate.middleware";

import { verifyUser } from "../middlewares/auth.middleware";
import { Login } from "../models/login.model";
import { login, userLogout } from "../controllers/auth.controller";

const authRoutes = express.Router();
authRoutes.post("/login", loginValidation(), validateApi, login);
authRoutes.get("/logout", verifyUser, userLogout);

export default authRoutes;
