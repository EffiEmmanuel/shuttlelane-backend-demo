import mongoose from "mongoose";

// SCHEMA: This schema is for all payments made on Shuttlelane
const paymentSchema = new mongoose.Schema({
  amount: {
    type: String,
  },

  currency: {
    type: String,
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

  bookingId: {
    type: mongoose.Types.ObjectId,
    ref: "booking",
  },

  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },

  email: {
    type: String,
    trim: true,
  },
});

const PaymentModel = mongoose.model("Payment", paymentSchema);

export default PaymentModel;
