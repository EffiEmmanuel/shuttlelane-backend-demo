import mongoose from "mongoose";

// SCHEMA: This schema is for Car Rental Bookings
const visaOnArrivalRateSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },

    isNigerianVisaRequired: {
      type: Boolean,
      required: true,
    },

    isBiometricsRequired: {
      type: Boolean,
      required: true,
    },

    visaFee: {
      type: String,
      required: true,
    },

    voaBaseFees: {
      type: mongoose.Types.ObjectId,
      ref: "voaBaseFee",
    },

    vat: {
      type: String,
      required: true,
    },

    total: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const VisaOnArrivalRateModel = mongoose.model(
  "VisaOnArrivalRate",
  visaOnArrivalRateSchema
);

export default VisaOnArrivalRateModel;
