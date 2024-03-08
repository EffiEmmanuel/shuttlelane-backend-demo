import express from "express";
import { verifyUserToken } from "../util/auth.helper.js";
import {
  calculateBookingTotal,
  createBooking,
  deleteBookingById,
  fetchRatePerMile,
  getBookingByBookingReference,
} from "../controller/booking.controller.js";

const bookingRouter = express.Router();

// Routes
// BOOKING ROUTES
// Create booking
bookingRouter.post("/", createBooking);
// Create booking
bookingRouter.get(
  "/get-booking-by-reference/:bookingReference",
  getBookingByBookingReference
);
// Delete booking
bookingRouter.delete("/delete-booking/:bookingId", deleteBookingById);

// RATE PER MILE
// Get rate per mile
bookingRouter.get("/rate-per-mile", fetchRatePerMile);

// BOOKING CALCULATIONS
// Calculate booking total
bookingRouter.post("/calculate-total", calculateBookingTotal);

export default bookingRouter;
