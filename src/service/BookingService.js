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
import BookingSuccessfulEmail from "../emailTemplates/userEmailTemplates/BookingSuccessfulEmail/index.js";
import ReactDOMServer from "react-dom/server";
import moment from "moment";
import AdminBookingCreatedEmailTemplate from "../emailTemplates/adminEmailTemplates/AdminBookingCreatedEmail/index.js";
import { sendSMS } from "../util/twilio.js";
import PaymentService from "./PaymentService.js";

const paymentService = new PaymentService(PaymentModel);

export default class BookingService {
  constructor(ShuttlelaneBookingModel) {
    this.BookingModel = ShuttlelaneBookingModel;
  }

  // This service CREATES a new booking
  async createBooking(booking, isAdminRequest) {
    console.log("BOOKING:", booking);
    // Generate booking reference
    const bookingReference = generateBookingReference(booking?.bookingType);

    let shuttlelaneBooking, smsMessage;

    try {
      let newBooking, justCreatedBooking;

      switch (booking?.bookingType) {
        case "Airport":
          const newAirportTransferBooking =
            await AirportTransferBookingModel.create({
              bookingReference,
              isRoundTrip: booking?.isRoundTrip,
              passengers: booking?.passengers,
              airline: booking?.airline,
              flightNumber: booking?.flightNumber,
              vehicleClass: booking?.vehicleClass,
              city: booking?.city,
              pickupAddress: booking?.pickupAddress,
              pickupCoordinates: booking?.pickupCoordinates,
              pickupDate: booking?.pickupDate,
              pickupTime: booking?.pickupTime,
              dropoffAddress: booking?.dropoffAddress,
              dropoffCoordinates: booking?.dropoffCoordinates,
              returnDate: booking?.returnDate ?? null,
              returnTime: booking?.returnTime ?? null,
              hasPriorityPass: booking?.hasPriorityPass,
              passType: booking?.passType ?? null,
              priorityPassCount: booking?.priorityPassCount ?? null,
            });

          console.log("NATBid:", newAirportTransferBooking);
          newBooking = await this.BookingModel.create({
            booking: newAirportTransferBooking?._id,
            bookingType: booking?.bookingType,
            bookingReference,
            bookingCurrency: booking?.bookingCurrency,
            bookingTotal: booking?.bookingTotal,
            paymentId: booking?.paymentId ?? null,
            title: booking?.title,
            firstName: booking?.firstName,
            lastName: booking?.lastName,
            email: booking?.email,
            mobile: booking?.mobile,
            user: booking?.userId ?? null,
            bookingSchemaType: "AirportTransferBooking",
          });

          justCreatedBooking = await this.BookingModel.findOne({
            _id: newBooking?._id,
          })
            .populate("booking")
            .populate("bookingCurrency")
            .populate("user");

          shuttlelaneBooking = justCreatedBooking;
          smsMessage = `Hello ${booking?.title ?? booking?.user?.title} ${
            booking?.firstName ?? booking?.user?.firstName
          }, Your Airport Transfer Service has been booked for ${moment(
            booking?.pickupDate
          ).format("MMM DD, YYYY")}, ${moment(booking?.pickupTime).format(
            "HH:MM A"
          )}. Your booking reference: ${bookingReference}. Thank you for using Shuttlelane.`;
          break;
        case "Car":
          console.log("HELLO FROM THIS PART OF THE CODE:", booking);
          const newCarBooking = await CarRentalBookingModel.create({
            bookingReference,
            days: booking?.days,
            city: booking?.citySelected,
            pickupAddress: booking?.pickupAddress,
            pickupCoordinates: booking?.pickupCoordinates,
            pickupDate: booking?.pickupDate,
            pickupTime: booking?.pickupTime,
            car: booking?.carSelected,
          });

          console.log("NATBid:", newCarBooking?._id);
          newBooking = await this.BookingModel.create({
            booking: newCarBooking?._id,
            bookingType: booking?.bookingType,
            bookingReference,
            bookingCurrency: booking?.bookingCurrency,
            bookingTotal: booking?.bookingTotal,
            paymentId: booking?.paymentId ?? null,
            title: booking?.title,
            firstName: booking?.firstName,
            lastName: booking?.lastName,
            email: booking?.email,
            mobile: booking?.mobile,
            user: booking?.userId ?? null,
            bookingSchemaType: "CarRentalBooking",
          });

          justCreatedBooking = await this.BookingModel.findOne({
            _id: newBooking?._id,
          })
            .populate("booking")
            .populate("bookingCurrency")
            .populate("user");

          shuttlelaneBooking = justCreatedBooking;
          smsMessage = `Hello ${booking?.title ?? booking?.user?.title} ${
            booking?.firstName ?? booking?.user?.firstName
          }, Your Car Rental Service has been booked for ${moment(
            booking?.pickupDate
          ).format("MMM DD, YYYY")}, ${moment(booking?.pickupTime).format(
            "HH:MM A"
          )}. Your booking reference: ${bookingReference}. Thank you for using Shuttlelane.`;
          break;
        case "Priority":
          console.log("HELLO FROM THIS PART OF THE CODE:", booking);
          const newPriorityBooking = await PriorityPassBookingModel.create({
            bookingReference,
            days: booking?.days,
            city: booking?.citySelected,
            pickupAddress: booking?.pickupLocation,
            pickupCoordinates: booking?.pickupCoordinates,
            pickupDate: booking?.pickupDate,
            pickupTime: booking?.pickupTime,
            service: booking?.selectedProtocol,
            pass: booking?.passSelected,
            airline: booking?.airline,
            flightNumber: booking?.flightNumber,
            passengers: booking?.passengers,
          });

          console.log("NATBid:", newPriorityBooking?._id);
          newBooking = await this.BookingModel.create({
            booking: newPriorityBooking?._id,
            bookingType: booking?.bookingType,
            bookingReference,
            bookingCurrency: booking?.bookingCurrency,
            bookingTotal: booking?.bookingTotal,
            paymentId: booking?.paymentId ?? null,
            title: booking?.title,
            firstName: booking?.firstName,
            lastName: booking?.lastName,
            email: booking?.email,
            mobile: booking?.mobile,
            user: booking?.userId ?? null,
            bookingSchemaType: "PriorityPassBooking",
          });

          justCreatedBooking = await this.BookingModel.findOne({
            _id: newBooking?._id,
          })
            .populate("booking")
            .populate("bookingCurrency")
            .populate("user");

          shuttlelaneBooking = justCreatedBooking;
          smsMessage = `Hello ${booking?.title ?? booking?.user?.title} ${
            booking?.firstName ?? booking?.user?.firstName
          }, Your Priority Pass Service has been booked for ${moment(
            booking?.pickupDate
          ).format("MMM DD, YYYY")}, ${moment(booking?.pickupTime).format(
            "HH:MM A"
          )}. Your booking reference: ${bookingReference}. Thank you for using Shuttlelane.`;
          break;
        case "Visa":
          console.log("HELLO FROM THIS PART OF THE CODE::", booking);
          const newVisaBooking = await VisaOnArrivalBookingModel.create({
            bookingReference,
            // GENERAL INFORMATION
            nationality: booking?.nationality,
            visaClass: booking?.visaClass,
            passportType: booking?.passportType,
            // BIODATA
            passportPhotograph: booking?.passportPhotograph,
            title: booking?.title,
            surname: booking?.surname,
            firstName: booking?.firstName,
            middleName: booking?.middleName,
            email: booking?.email,
            dateOfBirth: booking?.dateOfBirth,
            placeOfBirth: booking?.placeOfBirth,
            gender: booking?.gender,
            maritalStatus: booking?.maritalStatus,
            passportNumber: booking?.passportNumber,
            passportExpiryDate: booking?.passportExpiryDate,
            // TRAVEL INFORMATION
            purposeOfJourney: booking?.purposeOfJourney,
            airline: booking?.airline,
            flightNumber: booking?.flightNumber,
            countryOfDeparture: booking?.countryOfDeparture,
            departureDate: booking?.departureDate,
            arrivalDate: booking?.arrivalDate,
            portOfEntry: booking?.portOfEntry,
            durationOfStay: booking?.durationOfStay,
            // Contact / Hotel Details In Nigeria
            contactName: booking?.contactName,
            contactNumber: booking?.contactNumber,
            contactAddress: booking?.contactAddress,
            contactCity: booking?.contactCity,
            contactState: booking?.contactState,
            contactEmail: booking?.contactEmail,
            contactPostalCode: booking?.contactPostalCode,
          });

          console.log("NATBid:", newVisaBooking?._id);
          newBooking = await this.BookingModel.create({
            booking: newVisaBooking?._id,
            bookingType: "Visa",
            bookingStatus: "Ongoing",
            bookingReference,
            bookingCurrency: booking?.bookingCurrency,
            bookingTotal: booking?.bookingTotal,
            paymentId: booking?.paymentId ?? null,
            title: booking?.title,
            firstName: booking?.firstName,
            lastName: booking?.lastName,
            email: booking?.email,
            mobile: booking?.mobile,
            user: booking?.userId ?? null,
            bookingSchemaType: "VisaOnArrivalBooking",
          });

          justCreatedBooking = await this.BookingModel.findOne({
            _id: newBooking?._id,
          })
            .populate("booking")
            .populate("bookingCurrency")
            .populate("user");

          shuttlelaneBooking = justCreatedBooking;
          smsMessage = `Hello ${booking?.title ?? booking?.user?.title} ${
            booking?.firstName ?? booking?.user?.firstName
          }, Your Visa On Arrival Service has been booked. Your booking reference: ${bookingReference}. Thank you for using Shuttlelane.`;
          break;

        default:
          break;
      }

      if (isAdminRequest) {
        const paymentPayload = {
          paymentStatus: "Successful",
          booking: justCreatedBooking?._id ?? shuttlelaneBooking?._id,
          gateway: "Admin Dashboard",
        };
        await paymentService.createPayment(paymentPayload);
      }

      const adminEmailHTML = AdminBookingCreatedEmailTemplate({
        bookingReference,
        firstName: booking?.firstName ?? booking?.user?.firstName,
        lastName: booking?.lastName ?? booking?.user?.lastName,
        mobile: booking?.mobile ?? booking?.user?.mobile,
        email: booking?.email ?? booking?.user?.email,
      });

      const adminMessage = {
        to: "info@shuttlelane.com",
        from: process.env.SENGRID_EMAIL,
        subject: "🔔 New Booking Notification",
        html: ReactDOMServer.renderToStaticMarkup(adminEmailHTML),
      };
      sendEmail(adminMessage);

      return {
        status: 201,
        message: "Your booking has been created successfully!",
        booking: shuttlelaneBooking,
      };
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

  // This service GETS dashboard statistics
  async getStatistics() {
    // Fetch the number of airport transfer bookings
    const numberOfAirportTransferBookings = await this.BookingModel.find({
      bookingType: "Airport",
    }).count();
    // Fetch the number of car rental bookings
    const numberOfCarRentalBookings = await this.BookingModel.find({
      bookingType: "Car",
    }).count();
    // Fetch the number of priority pass bookings
    const numberOfPriorityPassBookings = await this.BookingModel.find({
      bookingType: "Priority",
    }).count();
    // Fetch the number of visa on arrival bookings
    const numberOfVisaOnArrivalBookings = await this.BookingModel.find({
      bookingType: "Visa",
    }).count();
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

  async getBookings() {
    // Fetch the number of airport transfer bookings
    const airportTransferBookings = await this.BookingModel.find({
      bookingType: "Airport",
    })
      .populate("booking")
      .populate("bookingCurrency")
      .populate("paymentId")
      .populate("user")
      .sort({ createdAt: -1 });
    // Fetch the number of car rental bookings
    const carRentalBookings = await this.BookingModel.find({
      bookingType: "Car",
    })
      .populate("booking")
      .populate("bookingCurrency")
      .populate("paymentId")
      .populate("user")
      .sort({ createdAt: -1 });
    // Fetch the number of priority pass bookings
    const priorityPassBookings = await this.BookingModel.find({
      bookingType: "Priority",
    })
      .populate("booking")
      .populate("bookingCurrency")
      .populate("paymentId")
      .populate("user")
      .sort({ createdAt: -1 });
    // Fetch the number of visa on arrival bookings
    const visaOnArrivalBookings = await this.BookingModel.find({
      bookingType: "Visa",
    })
      .populate("booking")
      .populate("bookingCurrency")
      .populate("paymentId")
      .populate("user")
      .sort({ createdAt: -1 });

    return {
      status: 200,
      message: `Fetched bookings`,
      airportTransferBookings: airportTransferBookings,
      carRentalBookings: carRentalBookings,
      priorityPassBookings: priorityPassBookings,
      visaOnArrivalBookings: visaOnArrivalBookings,
    };
  }

  async getUpcomingAirportBookings() {
    // Fetch upcoming airport transfer bookings
    const airportTransferBookings = await this.BookingModel.find({
      bookingType: "Airport",
      bookingStatus: "Scheduled",
    })
      .populate("booking")
      .populate("bookingCurrency")
      .populate("paymentId")
      .populate("user")
      .sort({ createdAt: -1 });

    return {
      status: 200,
      message: `Fetched upcoming airport bookings`,
      upcomingBookings: airportTransferBookings,
    };
  }

  async getUpcomingCarBookings() {
    // Fetch upcoming car bookings
    const carRentalBookings = await this.BookingModel.find({
      bookingType: "Car",
      bookingStatus: "Scheduled",
    })
      .populate("booking")
      .populate("bookingCurrency")
      .populate("paymentId")
      .populate("user")
      .sort({ createdAt: -1 });

    return {
      status: 200,
      message: `Fetched upcoming car bookings`,
      upcomingBookings: carRentalBookings,
    };
  }

  async getUpcomingPriorityBookings() {
    // Fetch upcoming priority bookings
    const priorityPassBookings = await this.BookingModel.find({
      bookingType: "Priority",
      bookingStatus: "Scheduled",
    })
      .populate("booking")
      .populate("bookingCurrency")
      .populate("paymentId")
      .populate("user")
      .sort({ createdAt: -1 });

    return {
      status: 200,
      message: `Fetched upcoming priority bookings`,
      upcomingBookings: priorityPassBookings,
    };
  }

  async getUpcomingVisaBookings() {
    // Fetch upcoming visa bookings
    const visaOnArrivalBookings = await this.BookingModel.find({
      bookingType: "Visa",
      bookingStatus: "Ongoing",
    })
      .populate("booking")
      .populate("bookingCurrency")
      .populate("paymentId")
      .populate("user")
      .sort({ createdAt: -1 });

    return {
      status: 200,
      message: `Fetched upcoming visa bookings`,
      upcomingBookings: visaOnArrivalBookings,
    };
  }

  // This service GETS a booking by their id
  async getBookingById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any booking exists with the booking id
    const booking = await this.BookingModel.findOne({
      _id: _id,
    })
      .populate({
        path: "booking",
      })
      .populate({
        path: "bookingCurrency",
      })
      .populate({
        path: "paymentId",
      });

    if (!booking) {
      return {
        status: 404,
        message: "No booking exists with the id specified.",
      };
    }

    return {
      status: 200,
      message: `Fetched booking with id ${_id}.`,
      booking: booking,
    };
  }

  // This service GETS a booking by their booking reference
  async getBookingByBookingReference(bookingReference) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([bookingReference]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    let innerBookingPopulateField =
      bookingReference?.split("-")[0] == "AT"
        ? {
            path: "booking",
            populate: [
              {
                path: "vehicleClass",
              },
              { path: "priorityPassType" },
            ],
          }
        : bookingReference?.split("-")[0] == "CR"
        ? {
            path: "booking",
            populate: {
              path: "car",
              model: "Car",
            },
          }
        : bookingReference?.split("-")[0] == "PP"
        ? {
            path: "booking",
            populate: [
              {
                path: "city",
                model: "City",
              },
              {
                path: "pass",
                model: "PriorityPass",
              },
            ],
          }
        : {
            path: "booking",
          };

    // Check if any booking exists with the booking reference
    const booking = await this.BookingModel.findOne({
      bookingReference: bookingReference,
    })
      .populate(innerBookingPopulateField)
      .populate({
        path: "bookingCurrency",
      })
      .populate({
        path: "assignedDriver",
      })
      .populate({
        path: "assignedVendor",
      })
      .populate({
        path: "paymentId",
      })
      .populate({
        path: "assignedCar",
      })
      .populate({
        path: "vendorAssignedDriver",
      })
      .populate({
        path: "user",
      });

    if (!booking) {
      return {
        status: 404,
        message: "No booking exists with the reference specified.",
        booking: booking,
      };
    }

    return {
      status: 200,
      message: `Fetched booking with booking reference ${bookingReference}.`,
      booking: booking,
    };
  }

  // This service DELETES booking by id
  async deleteBookingById(_id) {
    console.log("BOOKING ID:", _id);
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any booking exists with the _id
    const booking = await this.BookingModel.findOneAndDelete({ _id: _id });
    console.log("deletedBooking:", booking);
    if (booking?.bookingType == "Airport") {
      await AirportTransferBookingModel.findOneAndDelete({
        bookingReference: booking?.bookingReference,
      });
    } else if (booking?.bookingType == "Car") {
      await CarRentalBookingModel.findOneAndDelete({
        bookingReference: booking?.bookingReference,
      });
    } else if (booking?.bookingType == "Priority") {
      await PriorityPassBookingModel.findOneAndDelete({
        bookingReference: booking?.bookingReference,
      });
    } else {
      await VisaOnArrivalBookingModel.findOneAndDelete({
        bookingReference: booking?.bookingReference,
      });
    }

    if (!booking) {
      return {
        status: 404,
        message: `No booking with _id ${_id} exists.`,
      };
    }

    const allBookings = await this.BookingModel.find()
      .populate("booking")
      .populate("paymentId")
      .populate("user")
      .populate("bookingCurrency")
      .sort({ createdAt: -1 });
    // Fetch upcoming bookings
    const bookingsAwaitingAssignment = await BookingModel.find({
      bookingStatus: "Not yet assigned",
    })
      .populate({
        path: "booking",
      })
      .populate({
        path: "bookingCurrency",
      })
      .populate({
        path: "assignedDriver",
      })
      .populate({
        path: "assignedVendor",
      })
      .populate({
        path: "paymentId",
      })
      .populate({
        path: "assignedDriver",
      })
      .populate({
        path: "user",
      })
      .sort({ createdAt: -1 });

    // Remove Visa On Arrival Bookings
    const filteredVoaBookings = bookingsAwaitingAssignment?.filter(
      (booking) => {
        return (
          booking?.bookingType !== "Visa" &&
          booking?.paymentId?.paymentStatus == "Successful"
        );
      }
    );

    // Fetch upcoming bookings
    const upcomingBookings = await this.BookingModel.find({
      bookingStatus: "Scheduled",
    })
      .populate({
        path: "booking",
      })
      .populate("paymentId")
      .populate("user")
      .populate("bookingCurrency")
      .sort({ createdAt: -1 });

    return {
      status: 201,
      message: `Booking deleted successfully.`,
      bookings: allBookings,
      bookingsAwaitingAssignment: filteredVoaBookings,
      upcomingBookings: upcomingBookings,
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

    const bookings = await this.BookingModel.find({})
      .populate("booking")
      .populate("bookingCurrency")
      .sort({ createdAt: -1 });

    return {
      status: 201,
      message: `Booking with _id ${_id} has been updated successfully.`,
      booking: booking,
    };
  }

  async calculateBookingTotal(userCurrency, bookingDetails) {
    console.log("BOOKING DETAILS:", bookingDetails);
    console.log("USER CURRENCY:", userCurrency);

    // Variables
    let sum, distanceMatrix, returnObject;
    const currencyToReturn = await CurrencyModel.findOne({ symbol: "₦" });

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
          userCurrency,
          bookingDetails?.city
        );

        sum = sum + Number(distanceMatrix?.billedDistanceTotal);

        console.log("DISTANCE MATRIX:", distanceMatrix);
        // Return a response
        returnObject = {
          status: 200,
          message: `Total Fetched`,
          total: sum,
          userCurrency: userCurrency ?? currencyToReturn,
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
          userCurrency: userCurrency ?? currencyToReturn,
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
          userCurrency: userCurrency ?? currencyToReturn,
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
          if (isCountrySupported?.isBiometricsRequired) {
            // Return a response
            returnObject = {
              status: 200,
              message: `Support successfully confirmed. You can now proceed to make a visa on arrival booking.`,
              visaFee: isCountrySupported?.visaFee,
              transactionFee: isCountrySupported?.voaBaseFees?.transactionFee,
              processingFee: isCountrySupported?.voaBaseFees?.processingFee,
              biometricFee: isCountrySupported?.voaBaseFees?.biometricFee,
              vat: isCountrySupported?.vat,
              total: isCountrySupported?.total,
              userCurrency: userCurrency,
              voaVerificationStatus: "visaRequired",
            };
          } else {
            // Return a response
            returnObject = {
              status: 200,
              message: `Support successfully confirmed. You can now proceed to make a visa on arrival booking.`,
              visaFee: isCountrySupported?.visaFee,
              transactionFee: isCountrySupported?.voaBaseFees?.transactionFee,
              processingFee: isCountrySupported?.voaBaseFees?.processingFee,
              vat: isCountrySupported?.vat,
              total: isCountrySupported?.total,
              userCurrency: userCurrency,
              voaVerificationStatus: "visaRequired",
            };
          }
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
            userCurrency: userCurrency ?? currencyToReturn,
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
