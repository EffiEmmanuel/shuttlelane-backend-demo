import BookingModel from "../model/booking.model.js";
import PriorityPassModel from "../model/priorityPass.model.js";
import BookingService from "../service/BookingService.js";
import { convertAmountToUserCurrency } from "../util/index.js";

// Generic messages
const internalServerError =
  "An error occured while we processed your request. Please try again.";

// SERVICE INSTANCES
// Create a new AdminService instance
const bookingService = new BookingService(BookingModel);

// Create Booking
export const createBooking = async (req, res) => {
  try {
    // Create new admin
    const response = await bookingService.createBooking(req.body);

    // return a response
    if (response?.status !== 201) {
      return res.status(response?.status).json({ message: response?.message });
    }

    return res.status(response?.status).json({
      message: response?.message,
      booking: response?.booking,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError, error: error });
  }
};

// RATE PER MILE
// Get rate per mile
export const fetchRatePerMile = async (req, res) => {
  try {
    // Fetch rate per mile
    const response = await bookingService.getRatePerMile();

    // Return a response
    return res.status(response?.status).json({
      ratePerMile: response?.ratePerMile ?? null,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Log in admin
export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  console.log("req.body:", req.body);
  console.log("username:", username);
  console.log("password:", password);

  console.log("Hi");
  try {
    // Log in admin
    const response = await bookingService.loginAdmin(username, password);

    // return a response
    if (response?.status !== 200) {
      return res
        .status(response?.status)
        .json({ message: response?.message, status: response?.status });
    }

    console.log("JWTTTTTTTTTTT:", response?.token);

    return res.status(response?.status).json({
      status: response?.status,
      message: response?.message,
      token: `${response?.token}`,
      admin: response?.admin,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get admin by email
export const getUserByEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Fetch admin
    const response = await bookingService.getUserByEmail(email);
    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get statistics
export const getStatistics = async (req, res) => {
  try {
    // Fetch statistics
    const response = await bookingService.getStatistics();

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      numberOfAirportTransferBookings:
        response?.numberOfAirportTransferBookings,
      numberOfCarRentalBookings: response?.numberOfCarRentalBookings,
      numberOfPriorityPassBookings: response?.numberOfPriorityPassBookings,
      numberOfVisaOnArrivalBookings: response?.numberOfVisaOnArrivalBookings,
      users: response?.users,
      drivers: response?.drivers,
      upcomingBookings: response?.upcomingBookings,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get admins
// TO-DO: Transfer to admin controller
export const getUsers = async (req, res) => {
  try {
    // Fetch admins
    const admins = await bookingService.getUsers();

    // Return a response
    return res
      .status(admins?.status)
      .json({ admins: admins?.admin ?? null, message: admins?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Delete admin by email
export const deleteUserByEmail = async (req, res) => {
  const { email } = req.body;
  try {
    // DELETE admin
    const response = await bookingService.deleteUserByEmail(email);

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Delete admin by id
export const deleteUserById = async (req, res) => {
  const { adminId } = req.params;
  try {
    // DELETE admin
    const response = await bookingService.deleteUserById(adminId);

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Update admin by id
export const updateUserById = async (req, res) => {
  const { adminId } = req.params;

  try {
    // UPDATE admin
    const response = await bookingService.updateUserById(adminId, ...req.body);

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get admin total spend by admin id
export const getUserTotalSpendByUserId = async (req, res) => {
  const { adminId } = req.params;

  try {
    // Fetch admin
    const response = await bookingService.getUserTotalSpendByUserId(adminId);

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get admin bookings by admin id
export const getUserBookingsByUserId = async (req, res) => {
  const { adminId } = req.params;

  try {
    // Fetch admin
    const response = await bookingService.getUserBookingsByUserId(adminId);

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Calculate booking total
export const calculateBookingTotal = async (req, res) => {
  const { userCurrency, bookingDetails } = req.body;

  try {
    // Calculate the total
    const response = await bookingService.calculateBookingTotal(
      userCurrency,
      bookingDetails
    );

    // Return a response
    return res.status(response?.status).json({
      ...response,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};
