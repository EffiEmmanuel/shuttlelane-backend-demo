import express from "express";
import { verifyUserToken } from "../util/auth.helper.js";
import { fetchPasses } from "../controller/priorityPass.controller.js";

const priorityPassRouter = express.Router();

// Routes
// Get passes
priorityPassRouter.get("/", fetchPasses);

export default priorityPassRouter;
