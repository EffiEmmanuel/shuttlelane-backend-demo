import mongoose from "mongoose";

// SCHEMA: This schema is for Suppliers (Vendors)
const vendorSchema = new mongoose.Schema(
  {
    // Company info
    image: {
      type: String,
    },

    companyName: {
      type: String,
      required: true,
    },

    openingHours: {
      type: Date,
    },

    isOpen24Hours: {
      type: Boolean,
      required: true,
      default: false,
    },

    closingHours: {
      type: Date,
    },

    companyEmail: {
      type: String,
      trim: true,
      match: /.+\@.+\..+/,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    operatingCities: [
      {
        type: String,
      },
    ],

    fleetSize: {
      type: String,
      required: true,
    },

    fleetType: [
      {
        type: String,
      },
    ],

    // Contact Information
    contactName: {
      type: String,
      required: true,
    },

    contactEmail: {
      type: String,
      trim: true,
      match: /.+\@.+\..+/,
      required: true,
    },

    contactMobile: {
      type: String,
      required: true,
    },

    // Account Security
    password: {
      type: String,
      required: true,
    },

    // Account details
    bank: {
      type: String,
      required: true,
    },

    accountName: {
      type: String,
      required: true,
    },

    accountNumber: {
      type: String,
      required: true,
    },

    bookingsAssignedTo: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Booking",
      },
    ],

    completedBookings: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Booking",
      },
    ],

    upcomingBookings: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Booking",
      },
    ],

    phoneVerification: {
      type: Boolean,
      default: false,
    },

    isAccountApproved: {
      type: Boolean,
      default: false,
    },

    isAccountBlocked: {
      type: Boolean,
      default: false,
    },

    fleet: [
      {
        type: mongoose.Types.ObjectId,
        ref: "VendorFleet",
      },
    ],

    drivers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "VendorDriver",
      },
    ],
  },
  { timestamps: true }
);

const VendorModel = mongoose.model("Vendor", vendorSchema);

export default VendorModel;
