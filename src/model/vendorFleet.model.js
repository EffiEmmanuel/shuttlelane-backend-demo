import mongoose from "mongoose";

// SCHEMA: This schema is for Cars in avendor's fleet
const vendorFleetSchema = new mongoose.Schema(
  {
    carName: {
      type: String,
      required: true,
    },

    carModel: {
      type: String,
      required: true,
    },

    carType: {
      type: String,
      required: true,
    },

    carYear: {
      type: String,
      required: true,
    },

    carColor: {
      type: String,
      required: true,
    },

    carPlateNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const VendorFleetModel = mongoose.model("VendorFleet", vendorFleetSchema);

export default VendorFleetModel;
