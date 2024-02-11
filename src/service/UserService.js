import bcrypt from "bcryptjs";
import {
  validateFields,
  validateUserLoginDetails,
} from "../util/auth.helper.js";
import jsonwebtoken from "jsonwebtoken";
import { checkUserEmailValidity } from "../util/db.helper.js";
import PaymentModel from "../model/payment.model.js";
import BookingModel from "../model/booking.model.js";
import CityModel from "../model/city.model.js";
import VisaOnArrivalRateModel from "../model/visaOnArrivalRate.model.js";

export default class UserService {
  constructor(ShuttlelaneUserModel) {
    this.UserModel = ShuttlelaneUserModel;
  }

  // This service CREATES a new user - Sign up service
  async signupUser(user) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([
      user.firstName,
      user.lastName,
      user.countryCode,
      user.mobile,
      user.email,
      user.password,
    ]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if user is already signed up
    const userAlreadyExistsWithEmail = await checkUserEmailValidity(user.email);

    // If user email already exists
    if (userAlreadyExistsWithEmail.status === 409)
      return userAlreadyExistsWithEmail;

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    console.log("hp:", hashedPassword);

    // If the email is available, then proceed to sign up the user
    const newUser = await this.UserModel.create({
      ...user,
      password: hashedPassword,
    });

    // TO-DO: Send confirmation email here

    return {
      status: 201,
      message: "Your account has been created successfully!",
      user: newUser,
    };
  }

  // This service logs in the user
  async loginUser(email, password) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([email, password]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // If the fields are not empty, check the DB for email
    const userExists = await validateUserLoginDetails(email, password);

    // TODO: If user has 2FA turned on, Send OTP to user's email
    // return {
    //     status: 200,
    //     message: 'An OTP was sent to your registered email.'
    // }

    return userExists;
  }

  // This service GETS a user by their email
  async getUserByEmail(email) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([email]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any user exists with the email
    const user = await this.UserModel.findOne({
      email: email,
    }).populate({
      path: "bookings",
    });

    if (!user) {
      return {
        status: 404,
        message: "No user exists with the email specified.",
        user: user,
      };
    }

    return {
      status: 200,
      message: `Fetched user with email ${email}.`,
      user: user,
    };
  }

  // This service GETS a user by their id
  async getUserById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any user exists with the username
    const user = await this.UserModel.findOne({
      _id: _id,
    }).populate({
      path: "bookings",
    });

    if (!user) {
      return {
        status: 404,
        message: "No user exists with the id specified.",
        user: user,
      };
    }

    return {
      status: 200,
      message: `Fetched user with id ${_id}.`,
      user: user,
    };
  }

  // This service DELETES user by email
  // TO-DO: Send OTP along with the email to verify the user is actually sending the request to delete his/her account
  async deleteUserByEmail(email) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([email]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any user exists with the email
    const user = await this.UserModel.findOneAndRemove({ email: email });

    if (!user) {
      return {
        status: 404,
        message: `No user with email ${email} exists.`,
      };
    }

    return {
      status: 201,
      message: `User with email ${email} has been deleted successfully.`,
    };
  }

  // This service DELETES user by id
  async deleteUserById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any user exists with the _id
    const user = await this.UserModel.findOneAndRemove({ _id: _id });

    if (!user) {
      return {
        status: 404,
        message: `No user with _id ${_id} exists.`,
      };
    }

    return {
      status: 201,
      message: `User with _id ${_id} has been deleted successfully.`,
    };
  }

  // This service UPDATES a user by id
  async updateUserById(_id, updatedUser) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, updatedUser]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any user exists with the _id
    const user = await this.UserModel.findOneAndUpdate(
      { _id: _id },
      { ...updatedUser }
    );

    if (!user) {
      return {
        status: 404,
        message: `No user with _id ${_id} exists.`,
      };
    }

    return {
      status: 201,
      message: `User with _id ${_id} has been updated successfully.`,
    };
  }

  // This service GETS the user's total spend by the user id
  async getUserTotalSpendByUserId(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Fetch all payments with the _id provided
    const payments = await PaymentModel.find({ userId: _id });

    return {
      status: 200,
      message: `All user's payments have been fetched successfully.`,
      payments: payments,
    };
  }

  // This service GETS the user's bookings the user id
  async getUserBookingsByUserId(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Fetch all bookings with the _id provided
    const bookings = await BookingModel.find({ user: _id });

    return {
      status: 200,
      message: `All user's bookings have been fetched successfully.`,
      bookings: bookings,
    };
  }

  // This service GETS all cities
  async getCities() {
    // Fetch cities
    const cities = await CityModel.find({});

    return {
      status: 200,
      message: `Fetched cities`,
      cities: cities,
    };
  }

  // VISA ON ARRIVAL RATES
  // This service GETS all visa on arrival rates
  async getVisaOnArrivalRates() {
    // Get visaOnArrivalRates
    const visaOnArrivalRates = await VisaOnArrivalRateModel.find({}).sort({
      createdAt: -1,
    });

    return {
      status: 200,
      message: `Fetched visa on arrival rates.`,
      visaOnArrivalRates: visaOnArrivalRates,
    };
  }
  // This service GETS all visa on arrival rates THAT REQUIRE NIGERIAN VISA
  async getVisaOnArrivalRatesWithNigerianVisa() {
    // Get getVisaOnArrivalRatesWithNigerianVisa
    const visaOnArrivalRates = await VisaOnArrivalRateModel.find({
      isNigerianVisaRequired: true,
    }).sort({
      createdAt: -1,
    });

    console.log("VOA RATES:", visaOnArrivalRates);

    return {
      status: 200,
      message: `Fetched visa on arrival rates with Nigerian visa requirement.`,
      visaOnArrivalRates: visaOnArrivalRates,
    };
  }
}
