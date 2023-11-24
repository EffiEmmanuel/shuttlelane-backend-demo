import express from "express";
import { verifyUserToken } from "../util/auth.helper.js";
import { fetchVehicleClasses } from "../controller/vehicleClass.controller.js";

const vehicleClassRouter = express.Router();

// Routes
// Get vehicle classes
vehicleClassRouter.get("/", fetchVehicleClasses);

export default vehicleClassRouter;
