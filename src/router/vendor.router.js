import express from "express";
import { verifyUserToken } from "../util/auth.helper.js";
import {
  acceptBooking,
  createVendorCar,
  createVendorDriver,
  declineBooking,
  deleteVendorById,
  deleteVendorDriverById,
  deleteVendorFleetById,
  endBooking,
  getVendorAssignedJobs,
  getVendorBookingsByVendorId,
  getVendorById,
  getVendorCompletedJobs,
  getVendorDrivers,
  getVendorEarnings,
  getVendorFleet,
  getVendorOngoingJobs,
  getVendorUpcomingJobs,
  loginVendor,
  resetVendorPassword,
  signupVendor,
  startBooking,
  updateVendorById,
  updateVendorDriverById,
  updateVendorFleetById,
} from "../controller/vendor.controller.js";

const vendorRouter = express.Router();

console.log("VENDOR ROUTER");

// Routes
// SIGNUP VENDOR
vendorRouter.post("/signup", signupVendor);
// LOGIN VENDOR
vendorRouter.post("/login", loginVendor);
// GET VENDOR BY ID
vendorRouter.get("/get-vendor/:vendorId", verifyUserToken, getVendorById);
// GET VENDOR BOOKINGS BY VENDOR ID
vendorRouter.patch(
  "/bookings/:vendorId",
  verifyUserToken,
  getVendorBookingsByVendorId
);
// UPDATE VENDOR BY VENDOR ID
vendorRouter.patch(
  "/update-vendor/:vendorId",
  verifyUserToken,
  updateVendorById
);
// RESET VENDOR PASSWORD
vendorRouter.patch(
  "/reset-password/:vendorId",
  verifyUserToken,
  resetVendorPassword
);
// GET VENDOR'S COMPLETED JOBS
vendorRouter.get(
  "/bookings/completed/:vendorId",
  verifyUserToken,
  getVendorCompletedJobs
);
// GET VENDOR'S ASSIGNED JOBS
vendorRouter.get(
  "/bookings/assigned/:vendorId",
  verifyUserToken,
  getVendorAssignedJobs
);
// GET VENDOR'S UPCOMING JOBS
vendorRouter.get(
  "/bookings/upcoming/:vendorId",
  verifyUserToken,
  getVendorUpcomingJobs
);
// GET VENDOR'S ONGOING JOBS
vendorRouter.get(
  "/bookings/ongoing/:vendorId",
  verifyUserToken,
  getVendorOngoingJobs
);
// DELETE VENDOR BY ID
vendorRouter.delete(
  "/delete-vendor/:vendorId",
  verifyUserToken,
  deleteVendorById
);

// BOOKINGS
// ACCEPT BOOKING
vendorRouter.patch(
  "/booking/accept/:vendorId/:bookingId/:fleetId/:driverId",
  verifyUserToken,
  acceptBooking
);
// DECLINE BOOKING
vendorRouter.patch(
  "/booking/decline/:vendorId/:bookingId",
  verifyUserToken,
  declineBooking
);
// START BOOKING
vendorRouter.patch(
  "/booking/start/:vendorId/:bookingId",
  verifyUserToken,
  startBooking
);
// END BOOKING
vendorRouter.patch(
  "/booking/end/:vendorId/:bookingId",
  verifyUserToken,
  endBooking
);

// FETCH EARNINGS
vendorRouter.get("/earnings/:vendorId", verifyUserToken, getVendorEarnings);

// VENDOR DRIVERS
// GET DRIVERS
vendorRouter.get("/drivers", verifyUserToken, getVendorDrivers);
// CREATE DRIVER
vendorRouter.post("/drivers", verifyUserToken, createVendorDriver);
// UPDATE DRIVER
vendorRouter.patch(
  "/drivers/:vendorDriverId/:vendorId",
  verifyUserToken,
  updateVendorDriverById
);
// DELETE DRIVER
vendorRouter.delete(
  "/drivers/:vendorId/:driverId",
  verifyUserToken,
  deleteVendorDriverById
);

// VENDOR FLEET
// GET VENDOR FLEET
vendorRouter.get("/fleet", verifyUserToken, getVendorFleet);
// CREATE FLEET
vendorRouter.post("/fleet", verifyUserToken, createVendorCar);
// UPDATE FLEET
vendorRouter.patch(
  "/fleet/update/:fleetId/:vendorId",
  verifyUserToken,
  updateVendorFleetById
);
// DELETE FLEET
vendorRouter.delete(
  "/fleet/:vendorId/:fleetId",
  verifyUserToken,
  deleteVendorFleetById
);

export default vendorRouter;
