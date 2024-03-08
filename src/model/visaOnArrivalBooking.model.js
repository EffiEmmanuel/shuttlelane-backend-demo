import mongoose from "mongoose";

// SCHEMA: This schema is for Car Rental Bookings
const visaOnArrivalBookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
    },

    // GENERAL INFORMATION
    nationality: {
      type: String,
    },

    visaClass: {
      type: String,
    },

    passportType: {
      type: String,
    },

    // BIODATA
    passportPhotograph: {
      type: String,
    },

    title: {
      type: String,
    },

    surname: {
      type: String,
    },

    firstName: {
      type: String,
    },

    middleName: {
      type: String,
    },

    email: {
      type: String,
      trim: true,
    },

    dateOfBirth: {
      type: String,
    },

    placeOfBirth: {
      type: String,
    },

    gender: {
      type: String,
    },

    maritalStatus: {
      type: String,
    },

    passportNumber: {
      type: String,
    },

    passportExpiryDate: {
      type: String,
    },

    // TRAVEL INFORMATION
    purposeOfJourney: {
      type: String,
    },

    airline: {
      type: String,
    },

    flightNumber: {
      type: String,
    },

    countryOfDeparture: {
      type: String,
    },

    departureDate: {
      type: String,
    },

    arrivalDate: {
      type: String,
    },

    portOfEntry: {
      type: String,
    },

    durationOfStay: {
      type: String,
    },

    // Contact / Hotel Details In Nigeria
    contactName: {
      type: String,
    },

    contactNumber: {
      type: String,
    },

    contactAddress: {
      type: String,
    },

    contactCity: {
      type: String,
    },

    contactState: {
      type: String,
    },

    contactEmail: {
      type: String,
    },

    contactPostalCode: {
      type: String,
    },

    status: {
      type: String,
    },
  },
  { timestamps: true }
);

const VisaOnArrivalBookingModel = mongoose.model(
  "VisaOnArrivalBooking",
  visaOnArrivalBookingSchema
);

export default VisaOnArrivalBookingModel;
