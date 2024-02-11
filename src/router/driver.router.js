import express from "express";
import { verifyUserToken } from "../util/auth.helper.js";
import {
  deleteDriverById,
  getDriverBookingsByDriverId,
  getDriverById,
  loginDriver,
  resetDriverPassword,
  signupDriver,
  updateDriverById,
} from "../controller/driver.controller.js";

const driverRouter = express.Router();

// Routes
// SIGNUP DRIVER
driverRouter.post("/signup", signupDriver);
// LOGIN DRIVER
driverRouter.post("/login", loginDriver);
// GET DRIVER BY ID
driverRouter.get("/get-driver/:driverId", verifyUserToken, getDriverById);
// GET DRIVER BOOKINGS BY DRIVER ID
driverRouter.patch(
  "/bookings/:driverId",
  verifyUserToken,
  getDriverBookingsByDriverId
);
// UPDATE DRIVER BY DRIVER ID
driverRouter.patch(
  "/update-driver/:driverId",
  verifyUserToken,
  updateDriverById
);
// RESET DRIVER PASSWORD
driverRouter.patch(
  "/reset-password/:driverId",
  verifyUserToken,
  resetDriverPassword
);
// DELETE DRIVER BY ID
driverRouter.delete(
  "/delete-driver/:driverId",
  verifyUserToken,
  deleteDriverById
);

export default driverRouter;
