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

    if (paymentExists) {
      return {
        status: 409,
        message:
          "Payment has already been made for this booking. Please contact support for further information.",
      };
    }

    const newPayment = await this.PaymentModel.create({
      ...payment,
    });

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

  // This service UPDATES a payment ** NOT NEEDED
  //   async updatePayment(paymentId, values) {
  //     // Validate if fields are empty
  //     const areFieldsEmpty = validateFields([paymentId]);

  //     // areFieldsEmpty is an object that contains a status and message field
  //     if (areFieldsEmpty) return areFieldsEmpty;

  //     // Check if any payment exists with the _id
  //     const payment = await this.PaymentModel.findOneAndUpdate(
  //       {
  //         _id: paymentId,
  //       },
  //       { ...values }
  //     );

  //     if (!payment) {
  //       return {
  //         status: 404,
  //         message: `No payment with _id ${paymentId} exists.`,
  //       };
  //     }

  //     const payments = await this.PaymentModel.find({}).sort({
  //       createdAt: -1,
  //     });

  //     return {
  //       status: 201,
  //       message: `Payment updated successfully.`,
  //       payments: payments,
  //     };
  //   }

  // This service DELETES a payment ** NOT NEEDED
  //   async deletePayment(paymentId) {
  //     // Validate if fields are empty
  //     const areFieldsEmpty = validateFields([paymentId]);

  //     // areFieldsEmpty is an object that contains a status and message field
  //     if (areFieldsEmpty) return areFieldsEmpty;

  //     // Check if any payment exists with the _id
  //     const payment = await this.PaymentModel.findOneAndRemove({
  //       _id: paymentId,
  //     });

  //     if (!payment) {
  //       return {
  //         status: 404,
  //         message: `No payment with _id ${paymentId} exists.`,
  //       };
  //     }

  //     const payments = await this.PaymentModel.find({}).sort({
  //       createdAt: -1,
  //     });

  //     return {
  //       status: 201,
  //       message: `Payment deleted successfully.`,
  //       payments: payments,
  //     };
  //   }
}
