import UserModel from "../model/user.model.js";
import UserService from "../service/UserService.js";

// Generic messages
const internalServerError =
  "An error occured while we processed your request. Please try again.";

// SERVICE INSTANCES
// Create a new UserService instance
const userService = new UserService(UserModel);

// Sign up user
export const signupUser = async (req, res) => {
  console.log("HI");
  const { firstName, lastName, email, countryCode, mobile, password } =
    req.body;

  try {
    // Create new user
    const response = await userService.signupUser({
      firstName,
      lastName,
      email,
      countryCode,
      mobile,
      password,
    });

    // return a response
    if (response?.status !== 201) {
      return res.status(response?.status).json({ message: response?.message });
    }

    return res.status(response?.status).json({
      message: response?.message,
      token: response?.token,
      user: response?.user,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Log in user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Log in user
    const response = await userService.loginUser(email, password);

    // return a response
    if (response?.status !== 200) {
      return res.status(response?.status).json({ message: response?.message });
    }

    return res.status(response?.status).json({
      message: response?.message,
      token: response?.token,
      user: response?.user,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get user by email
export const getUserByEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Fetch user
    const response = await userService.getUserByEmail(email);
    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get user by id
export const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user
    const response = await userService.getUserById(userId);

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get users
// TO-DO: Transfer to admin controller
export const getUsers = async (req, res) => {
  try {
    // Fetch users
    const users = await userService.getUsers();

    // Return a response
    return res
      .status(users?.status)
      .json({ users: users?.user ?? null, message: users?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Delete user by email
export const deleteUserByEmail = async (req, res) => {
  const { email } = req.body;
  try {
    // DELETE user
    const response = await userService.deleteUserByEmail(email);

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Delete user by id
export const deleteUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    // DELETE user
    const response = await userService.deleteUserById(userId);

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Update user by id
export const updateUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    // UPDATE user
    const response = await userService.updateUserById(userId, ...req.body);

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get user total spend by user id
export const getUserTotalSpendByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user
    const response = await userService.getUserTotalSpendByUserId(userId);

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get user bookings by user id
export const getUserBookingsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch user
    const response = await userService.getUserBookingsByUserId(userId);

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// CITIES
// Get Cities
export const getCities = async (req, res) => {
  try {
    // Fetch cities
    const response = await userService.getCities();

    // Return a response
    return res
      .status(response?.status)
      .json({ cities: response?.cities ?? null, message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// VISA ON ARRIVAL RATES
export const getVisaOnArrivalRates = async (req, res) => {
  try {
    // Fetch visa on arrival rates
    const response = await userService.getVisaOnArrivalRates();

    // Return a response
    return res.status(response?.status).json({
      visaOnArrivalRates: response?.visaOnArrivalRates ?? null,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// VISA ON ARRIVAL RATES WITH NIGERIEAN VISA REQUIRMENT
export const getVisaOnArrivalRatesWithNigerianVisa = async (req, res) => {
  console.log("HELLO FROM THE NG CONTROLLER");
  try {
    // Fetch visa on arrival rates with nigerian visa requirement
    const response = await userService.getVisaOnArrivalRatesWithNigerianVisa();

    // Return a response
    return res.status(response?.status).json({
      visaOnArrivalRates: response?.visaOnArrivalRates ?? null,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};