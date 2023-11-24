import bcrypt from "bcryptjs";
import { validateFields } from "../util/auth.helper.js";
import PaymentModel from "../model/payment.model.js";
import BookingModel from "../model/booking.model.js";
import { sendEmail } from "../util/sendgrid.js";
import AirportTransferBookingModel from "../model/airportTransferBooking.model.js";
import CarRentalBookingModel from "../model/carRentalBooking.model.js";
import PriorityPassBookingModel from "../model/priorityPassBooking.model.js";
import VisaOnArrivalBookingModel from "../model/visaOnArrivalBooking.model.js";
import UserModel from "../model/user.model.js";
import DriverModel from "../model/driver.model.js";
import { generateBookingReference } from "../util/index.js";
import RatePerMileModel from "../model/ratePerMile.model.js";

export default class BookingService {
  constructor(ShuttlelaneBookingModel) {
    this.BookingModel = ShuttlelaneBookingModel;
  }

  // This service CREATES a new booking
  async createBooking(booking) {
    // Generate booking reference
    const bookingReference = generateBookingReference(booking?.bookingType);

    // If the email is available, then proceed to sign up the booking
    const newBooking = await this.BookingModel.create({
      bookingType: booking?.bookingType,
      bookingReference,
      paymentId: booking?.paymentId,
      passengerTitle: booking?.title,
      firstName: booking?.firstName,
      lastName: booking?.lastName,
      email: booking?.email,
      countryCode: booking?.countryCode,
      mobile: booking?.mobile,
      user: booking?.userId ?? null,
    });

    let shuttlelaneBooking;

    try {
      switch (booking?.bookingType) {
        case "Airport Transfer":
          const newAirportTransferBooking = AirportTransferBookingModel.create({
            bookingReference,
            bookingId: newBooking?._id,
            isRoundTrip: booking?.isRoundTrip,
            passengers: booking?.passengers,
            airline: booking?.airline,
            flightNumber: booking?.flightNumber,
            vehicleClass: booking?.vehicleClass,
            city: booking?.city,
            pickupAddress: booking?.pickupAddress,
            pickupDate: booking?.pickupDate,
            pickupTime: booking?.pickupTime,
            dropoffAddress: booking?.dropoffAddress,
            returnDate: booking?.returnDate ?? null,
            returnTime: booking?.returnTime ?? null,
            hasPriorityPass: booking?.hasPriorityPass,
            passType: booking?.passType ?? null,
            priorityPassCount: booking?.priorityPassCount ?? null,
          });
          shuttlelaneBooking = newAirportTransferBooking;
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(
        "An error occured while creating your booking. Please try again ==> ",
        error
      );
      return {
        message: "An error occured while creating your booking.",
        status: 500,
      };
    }

    // TO-DO: Send confirmation email here
    // const message = {
    //   to: booking.email,
    //   from: process.env.SENGRID_EMAIL,
    //   subject: "This is a test subject",
    //   text: "Therefore, this is a test body also",
    //   html: "<h1>Therefore, this is a test body also</h1>",
    // };
    // await sendEmail(message);

    return {
      status: 201,
      message: "Your booking has been created successfully!",
      booking: shuttlelaneBooking,
    };
  }

  // RATE PER MILE
  // This service GETS the rate per mile
  async getRatePerMile() {
    // Get rate per mile
    const ratePerMile = await RatePerMileModel.find({});

    return {
      status: 200,
      message: `Fetched rate per mile.`,
      ratePerMile: ratePerMile[0],
    };
  }

  // This service logs in the booking
  async loginBooking(username, password) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([username, password]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // If the fields are not empty, check the DB for username
    const bookingExists = await validateBookingLoginDetails(username, password);

    // TODO: If booking has 2FA turned on, Send OTP to booking's username
    // return {
    //     status: 200,
    //     message: 'An OTP was sent to your registered username.'
    // }

    return bookingExists;
  }

  // This service GETS a booking by their email
  async getBookingByEmail(email) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([email]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any booking exists with the email
    const booking = await this.BookingModel.findOne({
      email: email,
    }).populate({
      path: "bookings",
    });

    if (!booking) {
      return {
        status: 404,
        message: "No booking exists with the email specified.",
        booking: booking,
      };
    }

    return {
      status: 200,
      message: `Fetched booking with email ${email}.`,
      booking: booking,
    };
  }

  // This service GETS dashboard statistics
  async getStatistics() {
    // Fetch the number of airport transfer bookings
    const numberOfAirportTransferBookings =
      await AirportTransferBookingModel.find().count();
    // Fetch the number of car rental bookings
    const numberOfCarRentalBookings =
      await CarRentalBookingModel.find().count();
    // Fetch the number of priority pass bookings
    const numberOfPriorityPassBookings =
      await PriorityPassBookingModel.find().count();
    // Fetch the number of visa on arrival bookings
    const numberOfVisaOnArrivalBookings =
      await VisaOnArrivalBookingModel.find().count();
    // Fetch users
    const users = await UserModel.find();
    // Fetch drivers
    const drivers = await DriverModel.find();
    // Fetch upcomingBookings
    const today = new Date(); // Get today's date
    const upcomingBookings = await BookingModel.find({
      pickupDate: { $gt: today },
    });

    // Fetch the total revenue
    const totalPayments = await PaymentModel.find({});

    return {
      status: 200,
      message: `Fetched statistics`,
      numberOfAirportTransferBookings: numberOfAirportTransferBookings,
      numberOfCarRentalBookings: numberOfCarRentalBookings,
      numberOfPriorityPassBookings: numberOfPriorityPassBookings,
      numberOfVisaOnArrivalBookings: numberOfVisaOnArrivalBookings,
      drivers: drivers,
      users: users,
      upcomingBookings: upcomingBookings,
    };
  }

  // This service GETS a booking by their id
  async getBookingById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any booking exists with the bookingname
    const booking = await this.BookingModel.findOne({
      _id: _id,
    }).populate({
      path: "bookings",
    });

    if (!booking) {
      return {
        status: 404,
        message: "No booking exists with the id specified.",
        booking: booking,
      };
    }

    return {
      status: 200,
      message: `Fetched booking with id ${_id}.`,
      booking: booking,
    };
  }

  // This service DELETES booking by email
  // TO-DO: Send OTP along with the email to verify the booking is actually sending the request to delete his/her account
  async deleteBookingByEmail(email) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([email]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any booking exists with the email
    const booking = await this.BookingModel.findOneAndRemove({ email: email });

    if (!booking) {
      return {
        status: 404,
        message: `No booking with email ${email} exists.`,
      };
    }

    return {
      status: 201,
      message: `Booking with email ${email} has been deleted successfully.`,
    };
  }

  // This service DELETES booking by id
  async deleteBookingById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any booking exists with the _id
    const booking = await this.BookingModel.findOneAndRemove({ _id: _id });

    if (!booking) {
      return {
        status: 404,
        message: `No booking with _id ${_id} exists.`,
      };
    }

    return {
      status: 201,
      message: `Booking with _id ${_id} has been deleted successfully.`,
    };
  }

  // This service UPDATES a booking by id
  async updateBookingById(_id, updatedBooking) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, updatedBooking]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any booking exists with the _id
    const booking = await this.BookingModel.findOneAndUpdate(
      { _id: _id },
      { ...updatedBooking }
    );

    if (!booking) {
      return {
        status: 404,
        message: `No booking with _id ${_id} exists.`,
      };
    }

    return {
      status: 201,
      message: `Booking with _id ${_id} has been updated successfully.`,
    };
  }
}
