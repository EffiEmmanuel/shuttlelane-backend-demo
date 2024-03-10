import express from "express";
import { verifyUserToken } from "../util/auth.helper.js";
import {
  acceptBooking,
  declineBooking,
  deleteDriverById,
  endBooking,
  getDriverAssignedJobs,
  getDriverBookingsByDriverId,
  getDriverById,
  getDriverCompletedJobs,
  getDriverEarnings,
  getDriverOngoingJobs,
  getDriverUpcomingJobs,
  loginDriver,
  resetDriverPassword,
  signupDriver,
  startBooking,
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
// GET DRIVER'S COMPLETED JOBS
driverRouter.get(
  "/bookings/completed/:driverId",
  verifyUserToken,
  getDriverCompletedJobs
);
// GET DRIVER'S ASSIGNED JOBS
driverRouter.get(
  "/bookings/assigned/:driverId",
  verifyUserToken,
  getDriverAssignedJobs
);
// GET DRIVER'S UPCOMING JOBS
driverRouter.get(
  "/bookings/upcoming/:driverId",
  verifyUserToken,
  getDriverUpcomingJobs
);
// GET DRIVER'S ONGOING JOBS
driverRouter.get(
  "/bookings/ongoing/:driverId",
  verifyUserToken,
  getDriverOngoingJobs
);
// DELETE DRIVER BY ID
driverRouter.delete(
  "/delete-driver/:driverId",
  verifyUserToken,
  deleteDriverById
);

// BOOKINGS
// ACCEPT BOOKING
driverRouter.patch(
  "/booking/accept/:driverId/:bookingId",
  verifyUserToken,
  acceptBooking
);
// DECLINE BOOKING
driverRouter.patch(
  "/booking/decline/:driverId/:bookingId",
  verifyUserToken,
  declineBooking
);
// START BOOKING
driverRouter.patch(
  "/booking/start/:driverId/:bookingId",
  verifyUserToken,
  startBooking
);
// END BOOKING
driverRouter.patch(
  "/booking/end/:driverId/:bookingId",
  verifyUserToken,
  endBooking
);

// FETCH EARNINGS
driverRouter.get("/earnings/:driverId", verifyUserToken, getDriverEarnings);

export default driverRouter;
