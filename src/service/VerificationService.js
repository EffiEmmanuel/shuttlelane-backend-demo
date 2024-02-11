import bcrypt from "bcryptjs";
import {
  validateFields,
  generateVerificationCode,
  jwtSign,
} from "../util/auth.helper.js";
import { sendSMS } from "../util/twilio.js";
import DriverModel from "../model/driver.model.js";
import VendorModel from "../model/vendor.model.js";
import UserModel from "../model/user.model.js";
import { sendEmail } from "../util/sendgrid.js";

export default class VerificationService {
  constructor(ShuttlelaneVerificationModel) {
    this.VerificationModel = ShuttlelaneVerificationModel;
  }

  // This service sends a new OTP to a registered user
  async resendOTP(user) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([user]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Generate verification code
    const smsVerificationCode = generateVerificationCode(4); // '4' refers to the
    // Add verification code to the verification model
    await this.VerificationModel.create({
      userId: user?._id,
      code: smsVerificationCode,
    });

    // Send sms
    const smsMessage = `An OTP was requested to verify your account with Shuttlelane. Use this code to verify your phone number: ${smsVerificationCode}. If this was not initiated by you, please contact support at info@shuttlelane.com.`;
    const response = await sendSMS(user?.mobile, smsMessage)
      .then((res) => {
        console.log("TWILIO RESPONSE:", res);
        return {
          status: 200,
          message:
            "An OTP was sent to your registered phone number. Use it to verify your account.",
        };
      })
      .catch((err) => {
        console.log("ERROR:", err);
        // Send a 500 status code back to the frontend
        return {
          status: 500,
          message:
            "An error occured while processing your request for a new One Time Password (OTP). Please, try again.",
        };
      });

    return response;
  }

  // This service verifies a user's OTP
  async verifyOTP(user, code, userType) {
    console.log("VALUES::", code, userType);
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([user, code, userType]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    let userDoc;

    switch (userType) {
      case "driver":
        userDoc = await DriverModel.findOne({ _id: user?._id });
        if (!userDoc)
          return {
            status: 404,
            message: "This driver account does not exist.",
          };
        break;
      case "vendor":
        userDoc = await VendorModel.findOne({ _id: user?._id });
        if (!userDoc)
          return {
            status: 404,
            message: "This vendor account does not exist.",
          };
        break;
      case "user":
        userDoc = await UserModel.findOne({ _id: user?._id });
        if (!userDoc)
          return {
            status: 404,
            message: "This user account does not exist.",
          };
        break;

      default:
        break;
    }

    // Check if any driver exists with the email
    const verifyOneTimePassword = await this.VerificationModel.findOne({
      userId: user?._id,
      code: code,
    });

    console.log("HI HI:", verifyOneTimePassword);

    if (!verifyOneTimePassword) {
      return {
        status: 404,
        message: "Invalid verification code provided.",
      };
    }

    // Update user
    let updatedUser;
    let updatedUserToReturn;
    if (userType == "driver") {
      updatedUser = await DriverModel.findOneAndUpdate(
        { _id: userDoc?._id },
        { phoneVerification: true }
      );
      updatedUserToReturn = await DriverModel.findOne({
        _id: updatedUser?._id,
      });
    } else if (userType == "user") {
      updatedUser = await UserModel.findOneAndUpdate(
        { _id: userDoc?._id },
        { phoneVerification: true }
      );
      updatedUserToReturn = await UserModel.findOne({ _id: updatedUser?._id });
    } else {
      // Vendor
      updatedUser = await VendorModel.findOneAndUpdate(
        { _id: userDoc?._id },
        { phoneVerification: true }
      );
      updatedUserToReturn = await VendorModel.findOne({
        _id: updatedUser?._id,
      });
    }

    const message = {
      to: updatedUser?.email,
      from: process.env.SENGRID_EMAIL,
      subject: "Account Veirfication Successful!🎉",
      html: `<h1>Account Successfully Veirfied!🎉</h1><p>Dear ${updatedUser?.firstName}, Your account has been successully verified. <p><a style="text-decoration: none; color: #fff; padding: 10px; background-color: "#262471">Log in</a><p>.`,
    };
    await sendEmail(message);

    const token = jwtSign(updatedUserToReturn);

    return {
      status: 200,
      message: `Phone verified successfully!`,
      user: updatedUserToReturn,
      token: token,
    };
  }
}
