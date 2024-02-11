import mongoose from "mongoose";
import shortid from "shortid";

// SCHEMA: This schema is for Airport Transfer Bookings which includes Airport Pickup and Airport Dropoff
const PriorityPassBookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
    },

    bookingId: {
      type: mongoose.Types.ObjectId,
      ref: "Booking",
    },

    service: {
      type: String,
    },

    city: {
      type: mongoose.Types.ObjectId,
      ref: "City",
    },

    pickupAddress: {
      type: String,
      required: true,
    },

    passengers: {
      type: Number,
    },

    pass: {
      type: mongoose.Types.ObjectId,
      ref: "PriorityPass",
    },

    flightNumber: {
      type: String,
    },

    date: {
      type: String,
    },

    time: {
      type: String,
    },

    airline: {
      type: String,
    },
  },
  { timestamps: true }
);

const PriorityPassBookingModel = mongoose.model(
  "PriorityPassBooking",
  PriorityPassBookingSchema
);

export default PriorityPassBookingModel;