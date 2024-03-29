import Stripe from "stripe";
const stripeInstance = Stripe(process.env.STRIPE_SECRET_KEY);
import BookingModel from "../model/booking.model.js";
import CurrencyModel from "../model/currency.model.js";
import { validateFields } from "../util/auth.helper.js";
import { convertAmountToUserCurrency } from "../util/index.js";

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
      .populate("bookingCurrency");

    if (paymentExists) {
      return {
        status: 409,
        message:
          "Payment has already been made for this booking. Please contact support for further information.",
      };
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

    // Fetch all payments (So the frontend can be update without having to refresh the page & to prevent making another request to get them)
    const payments = await this.PaymentModel.find().sort({
      createdAt: -1,
    });

    return {
      status: 201,
      message: `Payment successful!`,
    };
  }

  // This service fetches all payments
  async getPayments() {
    const payments = await this.PaymentModel.find({}).populate("booking");
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
    });

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
      success_url: "http://localhost:3000/payment_successful",
      cancel_url: "http://localhost:3000/payment_failed",
    });

    console.log("SESSION:", session);

    return {
      id: session?.id,
      url: session.url,
    };
  }
}
