import mongoose from "mongoose";

// SCHEMA: This schema is for Currencies on shuttlelane.com
const ratePerMileSchema = new mongoose.Schema(
  {
    // Exchange rate assumes Naira as the base currency
    rate: {
      type: String,
      required: true,
    },

    mile: {
      type: String,
      required: true,
    },

    city: {
      type: mongoose.Types.ObjectId,
      ref: "City",
      required: true,
    },
  },
  { timestamps: true }
);

const RatePerMileModel = mongoose.model("ratePerMile", ratePerMileSchema);

export default RatePerMileModel;
