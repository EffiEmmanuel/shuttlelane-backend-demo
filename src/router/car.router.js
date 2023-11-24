import express from "express";
import { verifyUserToken } from "../util/auth.helper.js";
import { fetchCars } from "../controller/car.controller.js";

const carRouter = express.Router();

// Routes
// Get cars
carRouter.get("/", fetchCars);

export default carRouter;
