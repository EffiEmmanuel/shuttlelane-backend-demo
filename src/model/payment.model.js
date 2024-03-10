import mongoose from "mongoose";

// SCHEMA: This schema is for all payments made on Shuttlelane
const paymentSchema = new mongoose.Schema({
  amount: {
    type: String,
  },

  currency: {
    type: mongoose.Types.ObjectId,
    ref: "Currency",
  },

  paymentId: {
    type: String,
  },

  paymentReceiptLink: {
    type: String,
  },

  paymentStatus: {
    type: String,
    enum: ["Successful", "Pending", "Failed"],
    default: "Pending",
  },

  booking: {
    type: mongoose.Types.ObjectId,
    ref: "Booking",
  },

  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },

  gateway: {
    type: String,
  },

  firstName: {
    type: String,
  },

  lastName: {
    type: String,
  },

  email: {
    type: String,
    trim: true,
  },
});

const PaymentModel = mongoose.model("Payment", paymentSchema);

export default PaymentModel;
