import mongoose from "mongoose";

// SCHEMA: This schema is for Suppliers (Vendors)
const vendorSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },

    companyName: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    alternateMobile: {
      type: String,
      required: true,
    },

    // Additional information
    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
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
      required: true,
    },

    bookingsAssignedTo: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Booking",
      },
    ],
  },
  { timestamps: true }
);

const VendorModel = mongoose.model("Vendor", vendorSchema);

export default VendorModel;
