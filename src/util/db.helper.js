import AdminModel from "../model/admin.model.js";
import DriverModel from "../model/driver.model.js";
import UserModel from "../model/user.model.js";
import VendorModel from "../model/vendor.model.js";
import VendorDriverModel from "../model/vendorDriver.model.js";

// This method checks if a user email is valid - if it exists in the DB or not
export async function checkUserEmailValidity(email) {
  const userExists = await UserModel.findOne({ email });
  if (userExists)
    return {
      message: "An account is already associated with the email provided.",
      status: 409,
      config: userExists,
    };

  return {
    message: "Available",
    status: 200,
  };
}

// This method checks if a driver email is valid - if it exists in the DB or not
export async function checkDriverEmailValidity(email) {
  const driverExists = await DriverModel.findOne({ email });
  if (driverExists)
    return {
      message: "An account is already associated with the email provided.",
      status: 409,
      config: driverExists,
    };

  return {
    message: "Available",
    status: 200,
  };
}

// This method checks if a vendor email is valid - if it exists in the DB or not
export async function checkVendorEmailValidity(email) {
  const vendorExists = await VendorModel.findOne({ companyEmail: email });
  if (vendorExists)
    return {
      message: "An account is already associated with the email provided.",
      status: 409,
      config: vendorExists,
    };

  return {
    message: "Available",
    status: 200,
  };
}

// This method checks if a vendor driver email is valid - if it exists in the DB or not
export async function checkVendorDriverEmailValidity(email) {
  const vendorDriverExists = await VendorDriverModel.findOne({ email: email });
  if (vendorDriverExists)
    return {
      message: "An account is already associated with the email provided.",
      status: 409,
      config: vendorDriverExists,
    };

  return {
    message: "Available",
    status: 200,
  };
}

// This method checks if an admin email is valid - if it exists in the DB or not
export async function checkAdminEmailValidity(email) {
  const adminExists = await AdminModel.findOne({ email });
  if (adminExists)
    return {
      message: "An account is already associated with the email provided.",
      status: 409,
      config: adminExists,
    };

  return {
    message: "Available",
    status: 200,
  };
}

// This method checks if an admin username is valid - if it exists in the DB or not
export async function checkAdminUsernameValidity(username) {
  const adminExists = await AdminModel.findOne({ username });
  if (adminExists)
    return {
      message: "An account is already associated with the username provided.",
      status: 409,
      config: adminExists,
    };

  return {
    message: "Available",
    status: 200,
  };
}
