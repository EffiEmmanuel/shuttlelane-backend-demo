// @ts-nocheck
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
import {
  calculateDistanceAndDuration,
  convertAmountToUserCurrency,
  generateBookingReference,
} from "../util/index.js";
import RatePerMileModel from "../model/ratePerMile.model.js";
import CurrencyModel from "../model/currency.model.js";
import PriorityPassModel from "../model/priorityPass.model.js";
import axios from "axios";
import CarModel from "../model/car.model.js";
import VoaBaseFeesModel from "../model/voaBaseFees.model.js";
import VisaOnArrivalRateModel from "../model/visaOnArrivalRate.model.js";

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

  async calculateBookingTotal(userCurrency, bookingDetails) {
    console.log("BOOKING DETAILS:", bookingDetails);

    // Variables
    let sum, distanceMatrix, returnObject;

    // Cases: Airport, Car, Priority, Visa
    switch (bookingDetails?.bookingType) {
      case "Airport":
        //   // Calculate the sum
        sum = Number(bookingDetails?.currentVehicleClass?.basePrice);
        console.log("FIRST SUM:", sum);
        if (bookingDetails?.isAddPriorityPass) {
          const passTotal =
            Number(bookingDetails?.passType?.value?.price) *
            Number(bookingDetails?.numberOfPasses?.value);

          console.log("PASS TOTAL:", passTotal);
          sum = sum + passTotal;
        }

        // Fetch distance between the two addresses
        distanceMatrix = await calculateDistanceAndDuration(
          bookingDetails?.pickupLocation,
          bookingDetails?.dropoffLocation,
          userCurrency
        );

        sum = sum + Number(distanceMatrix?.billedDistanceTotal);

        console.log("DISTANCE MATRIX:", distanceMatrix);
        // Return a response
        returnObject = {
          status: 200,
          message: `Total Fetched`,
          total: sum,
          userCurrency: userCurrency,
          distance: distanceMatrix?.distance,
          duration: distanceMatrix?.duration,
        };
        break;

      case "Car":
        // Get the car the user selected
        const car = await CarModel.findOne({
          _id: bookingDetails?.carSelected?.value?._id,
        });

        if (!car) {
          return {
            status: 404,
            message: `Car selected does not exist.`,
          };
        }

        // Calculate the sum
        sum =
          Number(bookingDetails?.carSelected?.value?.price) *
          Number(bookingDetails?.days);

        console.log("SUM:", sum);
        // Return a response
        returnObject = {
          status: 200,
          message: `Total Fetched`,
          total: sum,
          userCurrency: userCurrency,
        };
        break;

      case "Priority":
        // Get the priority pass the user selected
        const pass = await PriorityPassModel.findOne({
          _id: bookingDetails?.passSelected?.value?._id,
        });

        if (!pass) {
          return {
            status: 404,
            message: `Pass selected does not exist.`,
          };
        }

        // Calculate the sum
        sum =
          Number(bookingDetails?.passSelected?.value?.price) *
          Number(bookingDetails?.passengers);

        console.log("SUM:", sum);
        // Return a response
        returnObject = {
          status: 200,
          message: `Total Fetched`,
          total: sum,
          userCurrency: userCurrency,
        };
        break;

      case "Visa":
        // Check support for country
        const isCountrySupported = await VisaOnArrivalRateModel.findOne({
          country: bookingDetails?.country,
        }).populate("voaBaseFees");

        if (!isCountrySupported) {
          return {
            status: 404,
            message: `Sorry, we do not process a Nigerian visa on arrival for ${bookingDetails?.country} at the moment. Please do well to reach out to us via info@shuttlelane.com for further instructions. Thank you.`,
            voaVerificationStatus: "noSupport",
          };
        }

        if (isCountrySupported?.isNigerianVisaRequired) {
          // Return a response
          returnObject = {
            status: 200,
            message: `Support successfully confirmed. You can now proceed to make a visa on arrival booking.`,
            visaFee: isCountrySupported?.visaFee,
            transactionFee: isCountrySupported?.voaBaseFees?.transactionFee,
            processingFee: isCountrySupported?.voaBaseFees?.processingFee,
            biometricFee: isCountrySupported?.voaBaseFees?.biometricFee,
            vat: isCountrySupported?.voaBaseFees?.vat,
            total: isCountrySupported?.total,
            userCurrency: userCurrency,
            voaVerificationStatus: "visaRequired",
          };
        } else {
          // Return a response
          returnObject = {
            status: 200,
            message: `Citizens of ${bookingDetails?.country} do not require a visa to visit Nigeria.`,
            visaFee: isCountrySupported?.visaFee,
            transactionFee: isCountrySupported?.voaBaseFees?.transactionFee,
            processingFee: isCountrySupported?.voaBaseFees?.processingFee,
            biometricFee: isCountrySupported?.voaBaseFees?.biometricFee,
            vat: isCountrySupported?.voaBaseFees?.vat,
            total: isCountrySupported?.total,
            userCurrency: userCurrency,
            voaVerificationStatus: "visaNotRequired",
          };
        }
        break;

      default:
        break;
    }

    return returnObject;
  }

  async verifyCountryAvailability(country) {}
}
