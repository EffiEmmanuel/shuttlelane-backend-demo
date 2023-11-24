import mongoose from "mongoose";

// SCHEMA: This schema is for Car Rental Bookings
const visaOnArrivalBookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
    },

    bookingId: {
      type: mongoose.Types.ObjectId,
      ref: "Booking",
    },

    paymentId: {
      type: mongoose.Types.ObjectId,
      ref: "Payment",
    },

    status: {
      type: String,
    },
  },
  { timestamps: true }
);

const VisaOnArrivalBookingModel = mongoose.model(
  "VisaOnArrivalBooking",
  visaOnArrivalBookingSchema
);

export default VisaOnArrivalBookingModel;
