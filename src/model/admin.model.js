import mongoose from "mongoose";

// SCHEMA: This schema is for the Admin
const adminSchema = new mongoose.Schema(
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

    email: {
      type: String,
      trim: true,
      match: /.+\@.+\..+/,
      required: true,
    },

    username: {
      type: String,
      trim: true,
      required: true,
    },

    password: {
      type: String,
      //   required: true,
    },

    role: {
      type: String,
      required: true,
      default: "Blogger",
      enum: ["Super Admin", "Admin", "Blogger"],
    },

    accessRights: {
      overview: Boolean,
      assignPartner: Boolean,
      deleteBooking: Boolean,
      addBooking: Boolean,
      airportTransfer: Boolean,
      carRental: Boolean,
      priorityPass: Boolean,
      visaOnArrival: Boolean,
      citiesAndAirports: Boolean,
      manageAdminAccounts: Boolean,
      manageUsers: Boolean,
      manageDrivers: Boolean,
      manageVendors: Boolean,
      pushNotifications: Boolean,
      bulkEmail: Boolean,
      bookingRates: Boolean,
      exchangeRates: Boolean,
      blog: Boolean,
    },
  },
  { timestamps: true }
);

const AdminModel = mongoose.model("Admin", adminSchema);

export default AdminModel;
