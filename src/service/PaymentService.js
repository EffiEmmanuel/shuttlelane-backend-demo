// @ts-nocheck
import Stripe from "stripe";
const stripeInstance = Stripe(process.env.STRIPE_SECRET_KEY);
import BookingModel from "../model/booking.model.js";
import CurrencyModel from "../model/currency.model.js";
import { validateFields } from "../util/auth.helper.js";
import { convertAmountToUserCurrency } from "../util/index.js";
import { sendSMS } from "../util/twilio.js";
import moment from "moment";
import BookingSuccessfulEmail from "../emailTemplates/userEmailTemplates/BookingSuccessfulEmail/index.js";
import { sendEmail } from "../util/sendgrid.js";
import ReactDOMServer from "react-dom/server";
import AirportTransferBookingModel from "../model/airportTransferBooking.model.js";
import CarRentalBookingModel from "../model/carRentalBooking.model.js";
import PriorityPassBookingModel from "../model/priorityPassBooking.model.js";
import VisaOnArrivalBookingModel from "../model/visaOnArrivalBooking.model.js";

export default class PaymentService {
  constructor(ShuttlelanePaymentModel) {
    this.PaymentModel = ShuttlelanePaymentModel;
  }

  // This service CREATES a new payment
  async createPayment(payment) {
    const paymentExists = await this.PaymentModel.findOne({
      booking: payment?.booking,
      paymentStatus: "Successful",
    });
    const bookingExists = await BookingModel.findOne({
      _id: payment?.booking,
    })
      .populate("user")
      .populate("booking")
      .populate("bookingCurrency");

    if (paymentExists) {
      if (paymentExists?.paymentStatus !== "Successful") {
        return {
          status: 409,
          message:
            "Payment has already been made for this booking. Please contact support for further information.",
        };
      } else {
        const updatePayment = await this.PaymentModel.findOneAndUpdate(
          { _id: paymentExists?._id },
          {
            amount: bookingExists?.bookingTotal,
            currency: bookingExists?.bookingCurrency?._id,
            paymentStatus: payment?.paymentStatus,
            booking: payment?.booking,
            gateway: payment?.gateway,
            firstName:
              bookingExists?.user?.firstName ?? bookingExists?.firstName,
            lastName: bookingExists?.user?.lastName ?? bookingExists?.lastName,
            email: bookingExists?.user?.email ?? bookingExists?.email,
          }
        );
      }
    }

    if (!bookingExists) {
      return {
        status: 409,
        message: "Invalid booking id provided.",
      };
    }

    const newPayment = await this.PaymentModel.create({
      amount: bookingExists?.bookingTotal,
      currency: bookingExists?.bookingCurrency?._id,
      paymentStatus: payment?.paymentStatus,
      booking: payment?.booking,
      gateway: payment?.gateway,
      firstName: bookingExists?.user?.firstName ?? bookingExists?.firstName,
      lastName: bookingExists?.user?.lastName ?? bookingExists?.lastName,
      email: bookingExists?.user?.email ?? bookingExists?.email,
    });

    // Update booking payment status
    await BookingModel.findOneAndUpdate(
      { _id: payment?.booking },
      { paymentId: newPayment?._id }
    );

    let smsMessage, bookingDetails, booking;
    if (bookingExists?.bookingType == "Airport") {
      smsMessage = `Hello ${
        bookingExists?.title ?? bookingExists?.user?.title
      } ${
        bookingExists?.firstName ?? bookingExists?.user?.firstName
      }, Your Airport Transfer Service has been booked for ${moment(
        bookingExists?.booking?.pickupDate
      ).format("MMM DD, YYYY")}, ${moment(
        bookingExists?.booking?.pickupTime
      ).format("HH:MM A")}. Your booking reference: ${
        bookingExists?.bookingReference
      }. Thank you for using Shuttlelane.`;

      booking = await AirportTransferBookingModel.findOne({
        _id: bookingExists?.booking?._id,
      }).populate("vehicleClass");

      bookingDetails = {
        "Pick-up Address": bookingExists?.booking?.pickupAddress,
        Airline: bookingExists?.booking?.airline ?? "N/A",
        "Flight Number": bookingExists?.booking?.flightNumber ?? "N/A",
        "Pick-up Date": moment(bookingExists?.booking?.pickupDate).format(
          "MMM DD, YYYY"
        ),
        "Drop-off Address": bookingExists?.booking?.dropoffAddress,
        "Drop-off Date": moment(bookingExists?.booking?.dropoffDate).format(
          "MMM DD, YYYY"
        ),
        "Drop-off Time": moment(bookingExists?.booking?.dropoffTime).format(
          "HH:MM AA"
        ),
        "Vehicle Class": booking?.vehicleClass?.className,
        Passenger: `${bookingExists?.user?.title ?? bookingExists?.title} ${
          bookingExists?.user?.firstName ?? bookingExists?.firstName
        } ${bookingExists?.user?.lastName ?? bookingExists?.lastName}`,
      };
    } else if (bookingExists?.bookingType == "Car") {
      smsMessage = `Hello ${
        bookingExists?.title ?? bookingExists?.user?.title
      } ${
        bookingExists?.firstName ?? bookingExists?.user?.firstName
      }, Your Car Rental Service has been booked for ${moment(
        bookingExists?.booking?.pickupDate
      ).format("MMM DD, YYYY")}, ${moment(
        bookingExists?.booking?.pickupTime
      ).format("HH:MM A")}. Your booking reference: ${
        bookingExists?.bookingReference
      }. Thank you for using Shuttlelane.`;

      booking = await CarRentalBookingModel.findOne({
        _id: bookingExists?.booking?._id,
      }).populate("car");

      bookingDetails = {
        "Pick-up Address": bookingExists?.booking?.pickupAddress,
        "Pick-up Date": moment(bookingExists?.booking?.pickupDate).format(
          "MMM DD, YYYY"
        ),
        "Pick-up Time": moment(bookingExists?.booking?.pickupTime).format(
          "HH:MM AA"
        ),
        Car: booking?.car?.name,
        Days: bookingExists?.booking?.days,
        Passenger: `${bookingExists?.user?.title ?? bookingExists?.title} ${
          bookingExists?.user?.firstName ?? bookingExists?.firstName
        } ${bookingExists?.user?.lastName ?? bookingExists?.lastName}`,
      };
    } else if (bookingExists?.bookingType == "Priority") {
      smsMessage = `Hello ${
        bookingExists?.title ?? bookingExists?.user?.title
      } ${
        bookingExists?.firstName ?? bookingExists?.user?.firstName
      }, Your Priority Pass Service has been booked for ${moment(
        bookingExists?.booking?.pickupDate
      ).format("MMM DD, YYYY")}, ${moment(
        bookingExists?.booking?.pickupTime
      ).format("HH:MM A")}. Your booking reference: ${
        bookingExists?.bookingReference
      }. Thank you for using Shuttlelane.`;

      booking = await PriorityPassBookingModel.findOne({
        _id: bookingExists?.booking?._id,
      }).populate("pass");

      bookingDetails = {
        "Pick-up Address": bookingExists?.booking?.pickupAddress,
        Airline: bookingExists?.booking?.airline ?? "N/A",
        "Flight Number": bookingExists?.booking?.flightNumber ?? "N/A",
        "Pick-up Date": moment(bookingExists?.booking?.pickupDate).format(
          "MMM DD, YYYY"
        ),
        "Service Type": booking?.service,
        "Protocol Type": booking?.pass?.name,
        Passenger: `${bookingExists?.user?.title ?? bookingExists?.title} ${
          bookingExists?.user?.firstName ?? bookingExists?.firstName
        } ${bookingExists?.user?.lastName ?? bookingExists?.lastName}`,
      };
    } else if (bookingExists?.bookingType == "Visa") {
      smsMessage = `Hello ${
        bookingExists?.title ?? bookingExists?.user?.title
      } ${
        bookingExists?.firstName ?? bookingExists?.user?.firstName
      }, Your Visa On Arrival Service has been booked. Your booking reference: ${
        bookingExists?.bookingReference
      }. Thank you for using Shuttlelane.`;

      booking = await VisaOnArrivalBookingModel.findOne({
        _id: bookingExists?.booking?._id,
      }).populate("pass");

      bookingDetails = {
        Nationality: bookingExists?.booking?.nationality,
        "Visa Class": bookingExists?.booking?.visaClass,
        "Passport Type": bookingExists?.booking?.passportType,
        "Full Name": `${bookingExists?.booking?.title} ${bookingExists?.booking?.surname} ${bookingExists?.booking?.firstName} ${bookingExists?.booking?.middleName}`,
        Email: bookingExists?.booking?.email,
        "Date Of Birth": moment(bookingExists?.booking?.dateOfBirth).format(
          "MMM DD, YYYY"
        ),
        "Place Of Birth": bookingExists?.booking?.placeOfBirth,
        Gender: bookingExists?.booking?.gender,
        "Marital Status": bookingExists?.booking?.maritalStatus,
        "Passport Number": bookingExists?.booking?.passportNumber,
        "Passport Expiry Date": moment(
          bookingExists?.booking?.passportExpiryDate
        ).format("MMM DD, YYYY"),
        "Purpose Of Journey": bookingExists?.booking?.purposeOfJourney,
        Airline: bookingExists?.booking?.airline,
        "Flight Number": bookingExists?.booking?.flightNumber,
        "Country Of Departure": bookingExists?.booking?.countryOfDeparture,
        "Departure Date": moment(bookingExists?.booking?.departureDate).format(
          "MMM DD, YYYY"
        ),
        "Arrival Date": moment(bookingExists?.booking?.arrivalDate).format(
          "MMM DD, YYYY"
        ),
        "Port Of Entry": bookingExists?.booking?.portOfEntry,
        "Duration Of Stay": bookingExists?.booking?.durationOfStay,
        "Contact Name": bookingExists?.booking?.contactName,
        "Contact Number": bookingExists?.booking?.contactNumber,
        "Contact Address": bookingExists?.booking?.contactAddress,
        "Contact City": bookingExists?.booking?.contactCity,
        "Contact State": bookingExists?.booking?.contactState,
        "Contact Email": bookingExists?.booking?.contactEmail,
        "Contact Postal Code": bookingExists?.booking?.contactPostalCode,
      };
    }

    const emailHTML = BookingSuccessfulEmail({
      bookingReference: bookingExists?.bookingReference,
      booking: bookingExists,
      bookingType: bookingExists?.bookingType,
      bookingDetails,
      totalBilled: `${bookingExists?.bookingCurrency?.symbol}${bookingExists?.bookingTotal}`,
    });

    const message = {
      to: bookingExists?.user?.email ?? bookingExists?.email,
      from: process.env.SENGRID_EMAIL,
      subject: `${
        bookingExists?.bookingType == "Airport"
          ? "Airport Transfer"
          : bookingExists?.bookingType == "Car"
          ? "Car Rental"
          : bookingExists?.bookingType == "Priority"
          ? "Priority Pass"
          : bookingExists?.bookingType == "Visa"
          ? "Visa On Arrival"
          : ""
      } Booking Confirmation`,
      html: ReactDOMServer.renderToString(emailHTML),
    };
    await sendEmail(message);

    // Send sms
    await sendSMS(
      bookingExists?.user?.mobile ?? bookingExists?.mobile,
      smsMessage
    )
      .then((res) => {
        console.log("TWILIO RESPONSE:", res);
      })
      .catch((err) => {
        console.log("ERROR:", err);
      });

    // Fetch all payments (So the frontend can be update without having to refresh the page & to prevent making another request to get them)
    const payments = await this.PaymentModel.find().sort({
      createdAt: -1,
    });

    return {
      status: 201,
      message: `Payment successful!`,
      booking: booking,
    };
  }

  // This service fetches all payments
  async getPayments() {
    const payments = await this.PaymentModel.find({})
      .populate("booking")
      .populate("currency")
      .sort({ createdAt: -1 });
    // Return a response
    return {
      status: 200,
      message: `Payments fetched`,
      payments: payments,
    };
  }

  // This service fetches a payment
  async getPayment(paymentId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([paymentId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    const payment = await this.PaymentModel.findOne({
      _id: paymentId,
    })
      .populate("booking")
      .populate("currency")
      .sort({ createdAt: -1 });

    // Return a response
    return {
      status: 200,
      message: `Payment fetched`,
      payment: payment,
    };
  }

  // This service handles creating a Stripe payment intent
  async createStripePaymentIntent(products, bookingRef) {
    const booking = await BookingModel.findOne({
      bookingReference: bookingRef,
    }).populate("bookingCurrency");

    console.log("BOOKING REF:", bookingRef);
    console.log("BOOKING:", booking);

    console.log("PRODUCTS:", products);

    const lineItems = products?.map((product) => ({
      price_data: {
        currency: booking?.bookingCurrency?.alias?.toLowerCase(),
        product_data: {
          name: product?.name,
          images: [product?.image],
        },
        unit_amount: Math.round(product?.price * 100),
      },
      quantity: product?.quantity,
    }));

    // Create checkout session with Stripe
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `https://www.shuttlelane.com/booking/payment-status?bid=${booking?._id}&&status=success&&ch=Stripe`,
      cancel_url: `https://www.shuttlelane.com/booking/payment-status?bid=${booking?._id}&&status=failed&&ch=Stripe`,
    });

    console.log("SESSION:", session);

    return {
      id: session?.id,
      url: session.url,
    };
  }
}
