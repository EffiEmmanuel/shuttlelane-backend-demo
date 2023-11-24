import bcrypt from "bcryptjs";
import {
  validateFields,
  validateDriverLoginDetails,
} from "../util/auth.helper.js";
import jsonwebtoken from "jsonwebtoken";
import { checkDriverEmailValidity } from "../util/db.helper.js";
import PaymentModel from "../model/payment.model.js";
import BookingModel from "../model/booking.model.js";
import { sendEmail } from "../util/sendgrid.js";

export default class DriverService {
  constructor(ShuttlelaneDriverModel) {
    this.DriverModel = ShuttlelaneDriverModel;
  }

  // This service CREATES a new driver - Sign up service
  async signupDriver(driver) {
    console.log("DRIVER:", driver);
    // Check if driver is already signed up
    const driverAlreadyExistsWithEmail = await checkDriverEmailValidity(
      driver.email
    );

    // If driver email already exists
    if (driverAlreadyExistsWithEmail.status === 409)
      return driverAlreadyExistsWithEmail;

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(driver.password, salt);

    console.log("hp:", hashedPassword);

    // If the email is available, then proceed to sign up the driver
    const newDriver = await this.DriverModel.create({
      ...driver,
      password: hashedPassword,
    });

    // TO-DO: Send confirmation email here
    const message = {
      to: driver.email,
      from: process.env.SENGRID_EMAIL,
      subject: "This is a test subject",
      text: "Therefore, this is a test body also",
      html: `<h1>Sign up Successful!🎉</h1><p>Dear ${newDriver?.firstName}, Your driver account has been created successully. Our team will review your profile within the next 72 hours. You can log in to to view your account status <p><a href='https://www.shuttlelane.com/driver'>here</a>.`,
    };
    await sendEmail(message);

    return {
      status: 201,
      message: "Your account has been created successfully!",
      driver: newDriver,
    };
  }

  // This service logs in the driver
  async loginDriver(email, password) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([email, password]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // If the fields are not empty, check the DB for email
    const driverExists = await validateDriverLoginDetails(email, password);

    // TODO: If driver has 2FA turned on, Send OTP to driver's email
    // return {
    //     status: 200,
    //     message: 'An OTP was sent to your registered email.'
    // }

    return driverExists;
  }

  // This service GETS a driver by their email
  async getDriverByEmail(email) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([email]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any driver exists with the email
    const driver = await this.DriverModel.findOne({
      email: email,
    }).populate({
      path: "bookings",
    });

    if (!driver) {
      return {
        status: 404,
        message: "No driver exists with the email specified.",
        driver: driver,
      };
    }

    return {
      status: 200,
      message: `Fetched driver with email ${email}.`,
      driver: driver,
    };
  }

  // This service GETS a driver by their id
  async getDriverById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any driver exists with the drivername
    const driver = await this.DriverModel.findOne({
      _id: _id,
    }).populate({
      path: "bookings",
    });

    if (!driver) {
      return {
        status: 404,
        message: "No driver exists with the id specified.",
        driver: driver,
      };
    }

    return {
      status: 200,
      message: `Fetched driver with id ${_id}.`,
      driver: driver,
    };
  }

  // This service DELETES driver by email
  // TO-DO: Send OTP along with the email to verify the driver is actually sending the request to delete his/her account
  async deleteDriverByEmail(email) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([email]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any driver exists with the email
    const driver = await this.DriverModel.findOneAndRemove({ email: email });

    if (!driver) {
      return {
        status: 404,
        message: `No driver with email ${email} exists.`,
      };
    }

    return {
      status: 201,
      message: `Driver with email ${email} has been deleted successfully.`,
    };
  }

  // This service DELETES driver by id
  async deleteDriverById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any driver exists with the _id
    const driver = await this.DriverModel.findOneAndRemove({ _id: _id });

    if (!driver) {
      return {
        status: 404,
        message: `No driver with _id ${_id} exists.`,
      };
    }

    return {
      status: 201,
      message: `Driver with _id ${_id} has been deleted successfully.`,
    };
  }

  // This service UPDATES a driver by id
  async updateDriverById(_id, updatedDriver) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, updatedDriver]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any driver exists with the _id
    const driver = await this.DriverModel.findOneAndUpdate(
      { _id: _id },
      { ...updatedDriver }
    );

    if (!driver) {
      return {
        status: 404,
        message: `No driver with _id ${_id} exists.`,
      };
    }

    return {
      status: 201,
      message: `Driver with _id ${_id} has been updated successfully.`,
    };
  }

  // This service GETS the driver's total spend by the driver id
  async getDriverTotalSpendByDriverId(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Fetch all payments with the _id provided
    const payments = await PaymentModel.find({ driverId: _id });

    return {
      status: 200,
      message: `All driver's payments have been fetched successfully.`,
      payments: payments,
    };
  }

  // This service GETS the driver's bookings the driver id
  async getDriverBookingsByDriverId(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Fetch all bookings with the _id provided
    const bookings = await BookingModel.find({ driver: _id });

    return {
      status: 200,
      message: `All driver's bookings have been fetched successfully.`,
      bookings: bookings,
    };
  }
}
