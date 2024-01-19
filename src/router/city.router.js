import express from "express";
import { verifyUserToken } from "../util/auth.helper.js";
import { getCities } from "../controller/user.controller.js";

const cityRouter = express.Router();

// Routes
// Get Cities
cityRouter.get("/", getCities);

export default cityRouter;
