import mongoose from "mongoose";

// SCHEMA: This schema is for Vendor Drivers / Drivers under a vendor
const vendorDriverSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      match: /.+\@.+\..+/,
      required: true,
    },

    password: {
      type: String,
    },

    vendor: {
      type: mongoose.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
  },
  { timestamps: true }
);

const VendorDriverModel = mongoose.model("VendorDriver", vendorDriverSchema);

export default VendorDriverModel;
