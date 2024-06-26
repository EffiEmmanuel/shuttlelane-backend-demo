import mongoose from "mongoose";

// SCHEMA: This schema is for Drivers
const driverSchema = new mongoose.Schema(
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

    middleName: {
      type: String,
      required: true,
    },

    gender: {
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

    education: {
      type: String,
      required: true,
    },

    // Additional information
    carType: {
      type: String,
      required: true,
    },

    carName: {
      type: String,
      required: true,
    },

    carModel: {
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

    maritalStatus: {
      type: String,
      required: true,
    },

    bvn: {
      type: String,
      required: true,
    },

    nin: {
      type: String,
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

    state: {
      type: String,
      required: true,
    },

    dateOfBirth: {
      type: String,
      required: true,
    },

    driverLicense: {
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

    isDrivingForHailingPlatforms: {
      type: Boolean,
      required: true,
    },

    hailingPlatforms: {
      type: String,
    },

    // Emergency contact
    emergencyFirstName: {
      type: String,
      required: true,
    },

    emergencyLastName: {
      type: String,
      required: true,
    },

    emergencyAddress: {
      type: String,
      required: true,
    },

    emergencyMobile: {
      type: String,
      required: true,
    },

    emergencyRelationship: {
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
  },
  { timestamps: true }
);

const DriverModel = mongoose.model("Driver", driverSchema);

export default DriverModel;
