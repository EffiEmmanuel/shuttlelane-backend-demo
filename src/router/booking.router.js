import express from "express";
import { verifyUserToken } from "../util/auth.helper.js";
import {
  calculateBookingTotal,
  createBooking,
  fetchRatePerMile,
} from "../controller/booking.controller.js";

const bookingRouter = express.Router();

// Routes
// AIRPORT TRANSFER BOOKING ROUTES
bookingRouter.post("/", createBooking);

// RATE PER MILE
// Get rate per mile
bookingRouter.get("/rate-per-mile", fetchRatePerMile);

// BOOKING CALCULATIONS
// Calculate booking total
bookingRouter.post("/calculate-total", calculateBookingTotal);

export default bookingRouter;
