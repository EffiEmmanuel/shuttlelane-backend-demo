import mongoose from "mongoose";
import shortid from "shortid";

// SCHEMA: This schema serves as a "Parent Class" for all bookings which includes Airport Transfers, Car Hire and Priority Pass Bookings
const bookingSchema = new mongoose.Schema({
  bookingType: {
    type: String,
    enum: ["Airport", "Car", "Priority", "Visa"],
    required: true,
  },

  bookingStatus: {
    type: String,
    enum: ["Pending", "Approved", "Scheduled", "Cancelled", "Completed"],
    default: "Pending",
  },

  bookingReference: {
    type: String,
  },

  paymentId: {
    type: mongoose.Types.ObjectId,
    ref: "Payment",
  },

  // The following fields cover the passenger's details - (By default, these are guests on the website and on the mobile app)
  title: {
    type: String,
  },

  firstName: {
    type: String,
  },

  lastName: {
    type: String,
  },

  email: {
    type: String,
    trim: true,
    match: /.+\@.+\..+/,
  },

  mobile: {
    type: String,
  },

  // If booking was made by an authenticated user (From the mobile app)
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },

  // THE FOLLOWING INFORMATION ARE NOT REQUIRED AT INITIAL DOCUMENT CREATION
  // The following fields contain information about the DRIVER assigned to a particular booking
  assignedDriver: {
    type: mongoose.Types.ObjectId,
    ref: "Driver",
  },

  driverJobWasSentTo: {
    type: mongoose.Types.ObjectId,
    ref: "Driver",
  },

  isAssignedToDriver: {
    type: Boolean,
    default: false,
  },

  hasDriverAccepted: {
    type: Boolean,
    default: false,
  },

  hasDriverDeclined: {
    type: Boolean,
    default: false,
  },

  //   The following fields contain information about the VENDOR assigned to a particular booking
  assignedVendor: {
    type: mongoose.Types.ObjectId,
    ref: "Vendor",
  },

  isAssignedToVendor: {
    type: Boolean,
    default: false,
  },

  vendorJobWasSentTo: {
    type: String,
  },

  hasVendorAccepted: {
    type: Boolean,
    default: false,
  },

  hasVendorDeclined: {
    type: Boolean,
    default: false,
  },

  //   The following fields contain information about the car assigned to a particular booking
  assignedCar: {
    model: String,
    color: String,
    plateNumber: String,
  },
});

const BookingModel = mongoose.model("Booking", bookingSchema);
export default BookingModel;
