import UserModel from "../model/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import routes from "../routes.js";
import bcrypt from "bcryptjs";
import DriverModel from "../model/driver.model.js";
import AdminModel from "../model/admin.model.js";
import SupplierModel from "../model/vendor.model.js";
import config from "../config/index.js";
import { sendEmail } from "./sendgrid.js";

const { sign, verify } = jsonwebtoken;

// This function validates input fields
export function validateFields(args) {
  args.forEach((arg) => {
    if (!arg || arg === "") {
      return {
        status: 404,
        message: "Please fill in the missing fields",
      };
    }
  });
}

// This function generates a verification code
export function generateVerificationCode(digits) {
  const min = Math.pow(10, digits - 1); // Lower bound
  const max = Math.pow(10, digits) - 1; // Upper bound
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const jwtSign = (payload) => {
  const jwtToken = sign({ payload }, `${config.jwt.JWT_SECRET}`, {
    expiresIn: "24h",
  });
  return jwtToken;
};

export const jwtVerify = (token) => {
  try {
    return verify(token, `${config.jwt.JWT_SECRET}`);
  } catch (error) {
    return false;
  }
};

export const verifyJWT = (request, response) => {
  try {
    const authHeader = request.body.token;
    console.log("req.body token:", request.body.token);
    let result;
    if (authHeader) {
      console.log("token:", authHeader);
      result = jwtVerify(authHeader);
      console.log("result:", result);
      if (!result) {
        response
          .status(403)
          .json({ message: "Invalid bearer token", status: 403 });
      } else {
        response
          .status(200)
          .json({ message: "Token still Valid", status: 200 });
      }
    } else {
      response.status(500).send("Token is required!");
    }
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      error: error,
    });
  }
};

// Middleware
export const verifyUserToken = (request, response, next) => {
  try {
    const authHeader = request.headers.token;
    console.log("AUTH HEADER:", authHeader);
    let result;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      console.log("TOKEN:::", token);

      result = jwtVerify(token);
      if (!result) {
        response.status(400).send("Invalid bearer token");
      } else {
        request.decoded = result;
        next();
      }
    } else {
      response.status(500).send("Token is required!");
    }
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      error: error,
    });
  }
};

// This function validates the user log in OTP
export async function validateLoginOTP(otp) {}

// This function validates the user OTP
export async function validateOTP(otp) {}

// This function validates a user's login details provided
export async function validateUserLoginDetails(email, password) {
  const userExists = await UserModel.findOne({ email }).populate({
    path: "bookings",
    options: {
      sort: {
        createdAt: -1,
      },
    },
  });

  if (!userExists)
    return {
      message: "No account is associated with the email provided",
      status: 404,
    };

  const isPasswordCorrect = bcrypt.compareSync(password, userExists?.password);

  if (!isPasswordCorrect)
    return {
      message: "Invalid email or password",
      status: 403,
    };

  const token = await jwtSign(userExists);

  return {
    message: "Log in successful!",
    user: userExists,
    token: token,
    status: 200,
  };
}

// This function validates a driver's login details provided
export async function validateDriverLoginDetails(email, password) {
  const driverExists = await DriverModel.findOne({ email }).populate(
    "phoneVerification"
  );
  console.log("DRIVER RETURNED:", driverExists?.phoneVerification);
  if (!driverExists)
    return {
      message: "Invalid email provided",
      status: 409,
    };

  const isPasswordCorrect = bcrypt.compareSync(
    password,
    driverExists?.password
  );

  if (!isPasswordCorrect)
    return {
      message: "Invalid email or password",
      status: 403,
    };

  const token = jwtSign(driverExists);

  return {
    message: "Log in successful!",
    driver: driverExists,
    token: token,
    status: 200,
  };
}

// This function validates an admin's login details provided
export async function validateAdminLoginDetails(username, password) {
  const adminExists = await AdminModel.findOne({ username });
  if (!adminExists)
    return {
      message: "Invalid username provided",
      status: 409,
    };

  const isPasswordCorrect = bcrypt.compareSync(password, adminExists?.password);

  if (!isPasswordCorrect)
    return {
      message: "Invalid username or password",
      status: 403,
    };

  const token = jwtSign(adminExists);

  return {
    message: "Log in successful!",
    admin: adminExists,
    token: token,
    status: 200,
  };
}

// This function validates a supplier's login details provided
export async function validateSupplierLoginDetails(email, password) {
  const supplierExists = await SupplierModel.findOne({ email });
  if (!supplierExists)
    return {
      message: "Invalid email provided",
      status: 409,
    };

  const isPasswordCorrect = bcrypt.compareSync(
    password,
    supplierExists?.password
  );

  if (!isPasswordCorrect)
    return {
      message: "Invalid email or password",
      status: 403,
    };

  const token = jwtSign(supplierExists);

  return {
    message: "Log in successful!",
    supplier: supplierExists,
    token: token,
    status: 200,
  };
}

export async function resetPassword(_id, oldPassword, newPassword, userType) {
  try {
    let user;
    switch (userType) {
      case "driver":
        user = await DriverModel.findById(_id);
        break;
      case "user":
        user = await UserModel.findById(_id);
        break;
      case "vendor":
        user = await VendorModel.findById(_id);
        break;
      default:
        break;
    }

    if (!user)
      return { status: 400, message: "No user exists with the id specified." };

    const isPasswordCorrect = bcrypt.compareSync(oldPassword, user?.password);
    if (!isPasswordCorrect)
      return {
        message:
          "You have provided a wrong password. Your password was not reset.",
        status: 403,
      };

    // TO-DO: Perform security measures
    // Do not allow more than 3 attempts on password change / block the account after 3 attempts

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Hash the password
    user.password = hashedPassword;
    const updatedUserDoc = await user.save();

    // TO-DO: Send confirmation email here
    const message = {
      to: user.email,
      from: process.env.SENGRID_EMAIL,
      subject: "Password Reset Successful",
      html: `<h1>Your password has been reset successfully!</h1><p>Dear ${user?.firstName}, Your password has just been reset. If this was not initiated by you, please reach out to info@shuttlelane.com immediately.`,
    };
    await sendEmail(message);

    return {
      status: 201,
      message: `Your password has been successfully reset. You'll be required to log in again.`,
      user: updatedUserDoc,
    };
  } catch (error) {
    return {
      status: 500,
      message:
        "An error occured while processing your request. Please, try again.",
    };
  }
}