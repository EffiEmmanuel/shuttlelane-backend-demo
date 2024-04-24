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
      overview: { type: Boolean },
      assignPartner: { type: Boolean },
      deleteBooking: { type: Boolean },
      addBooking: { type: Boolean },
      airportTransfer: { type: Boolean },
      carRental: { type: Boolean },
      priorityPass: { type: Boolean },
      visaOnArrival: { type: Boolean },
      citiesAndAirports: { type: Boolean },
      manageAdminAccounts: { type: Boolean },
      manageUsers: { type: Boolean },
      manageDrivers: { type: Boolean },
      manageVendors: { type: Boolean },
      pushNotifications: { type: Boolean },
      bulkEmail: { type: Boolean },
      bookingRates: { type: Boolean },
      exchangeRates: { type: Boolean },
      blog: { type: Boolean },
    },
  },
  { timestamps: true }
);

const AdminModel = mongoose.model("Admin", adminSchema);

export default AdminModel;
