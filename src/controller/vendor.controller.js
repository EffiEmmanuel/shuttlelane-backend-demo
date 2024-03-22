import VendorModel from "../model/vendor.model.js";
import VerificationModel from "../model/verification.model.js";
import VendorService from "../service/VendorService.js";
import VerificationService from "../service/VerificationService.js";
import { resetPassword } from "../util/auth.helper.js";

// Generic messages
const internalServerError =
  "An error occured while we processed your request. Please try again.";

// SERVICE INSTANCES
// Create a new VendorService instance
const vendorService = new VendorService(VendorModel);
const verificationService = new VerificationService(VerificationModel);

// Sign up vendor
export const signupVendor = async (req, res) => {
  console.log("HI");
  console.log("VENDOR:", req.body);
  try {
    // Create new vendor
    const response = await vendorService.signupVendor({
      ...req.body,
    });

    // return a response
    if (response?.status !== 201) {
      return res.status(response?.status).json({ message: response?.message });
    }

    return res.status(response?.status).json({
      message: response?.message,
      token: response?.token,
      vendor: response?.vendor,
      status: response?.status,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ message: internalServerError, error });
  }
};

// Log in vendor
export const loginVendor = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Log in vendor
    const response = await vendorService.loginVendor(email, password);

    // return a response
    if (response?.status !== 200) {
      return res.status(response?.status).json({ message: response?.message });
    }

    return res.status(response?.status).json({
      message: response?.message,
      token: response?.token,
      vendor: response?.vendor,
      status: response?.status,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get vendor by email
export const getVendorByEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Fetch vendor
    const response = await vendorService.getVendorByEmail(email);
    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get vendor by id
export const getVendorById = async (req, res) => {
  const { vendorId } = req.params;

  try {
    // Fetch vendor
    const response = await vendorService.getVendorById(vendorId);

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Delete vendor by id
export const deleteVendorById = async (req, res) => {
  const { vendorId } = req.params;
  try {
    // DELETE vendor
    const response = await vendorService.deleteVendorById(vendorId);

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Update vendor by id
export const updateVendorById = async (req, res) => {
  const { vendorId } = req.params;

  console.log("HI FROM THE CONTROLLER MOD:", req.body);

  try {
    // UPDATE vendor
    const response = await vendorService.updateVendorById(vendorId, {
      ...req.body,
    });

    // Return a response
    return res.status(response?.status).json({
      status: response?.status,
      message: response?.message,
      vendor: response?.vendor,
      token: response?.token,
    });
  } catch (error) {
    console.log("ERROR FROM UPDATE VENDOR:", error);
    return res.status(500).json({ message: internalServerError });
  }
};

// Reset vendor password
export const resetVendorPassword = async (req, res) => {
  const { vendorId } = req.params;
  const { oldPassword, newPassword, userType } = req.body;

  try {
    // RESET password
    const response = await resetPassword(
      vendorId,
      oldPassword,
      newPassword,
      userType
    );

    // Return a response
    return res.status(response?.status).json({
      status: response?.status,
      message: response?.message,
    });
  } catch (error) {
    console.log("ERROR FROM RESET VENDOR PASSWORD:", error);
    return res.status(500).json({ message: internalServerError });
  }
};

// This service GETS all vendor's completed jobs
export const getVendorCompletedJobs = async (req, res) => {
  const { vendorId } = req.params;
  console.log("COMPLETED BOOKINGS:");

  try {
    // Fetch vendor's completed jobs
    const response = await vendorService.getVendorCompletedJobs(vendorId);

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      bookings: response?.bookings,
      status: response?.status,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// This service GETS all vendor's assigned jobs
export const getVendorAssignedJobs = async (req, res) => {
  const { vendorId } = req.params;
  console.log("ASSIGNED BOOKINGS:");

  try {
    // Fetch vendor's assigned jobs
    const response = await vendorService.getVendorAssignedJobs(vendorId);

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      bookings: response?.bookings,
      status: response?.status,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// This service GETS all vendor's upcoming jobs
export const getVendorUpcomingJobs = async (req, res) => {
  const { vendorId } = req.params;
  console.log("UPCOMING BOOKINGS:");

  try {
    // Fetch vendor's upcoming jobs
    const response = await vendorService.getVendorUpcomingJobs(vendorId);

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      bookings: response?.bookings,
      status: response?.status,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// This service GETS all vendor's ongoing jobs
export const getVendorOngoingJobs = async (req, res) => {
  const { vendorId } = req.params;

  try {
    // Fetch vendor's ongoing jobs
    const response = await vendorService.getVendorOngoingJobs(vendorId);

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      bookings: response?.bookings,
      status: response?.status,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get vendor bookings by vendor id
export const getVendorBookingsByVendorId = async (req, res) => {
  const { vendorId } = req.params;

  try {
    // Fetch vendor
    const response = await vendorService.getVendorBookingsByVendorId(vendorId);

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Accept booking
export const acceptBooking = async (req, res) => {
  const { vendorId, bookingId, fleetId, driverId } = req.params;

  try {
    // Accept booking
    const response = await vendorService.acceptJob(
      vendorId,
      bookingId,
      fleetId,
      driverId
    );

    // Return a response
    return res.status(response?.status).json({
      upcomingBookings: response?.upcomingBookings,
      assignedBookings: response?.assignedBookings,
      status: response?.status,
      message: response?.message,
    });
  } catch (error) {
    console.log("ERROR FROM ACCEPT BOOKING:", error);
    return res.status(500).json({ message: internalServerError });
  }
};

// Reject booking
export const declineBooking = async (req, res) => {
  const { vendorId, bookingId } = req.params;

  try {
    // Reject booking
    const response = await vendorService.declineJob(vendorId, bookingId);

    // Return a response
    return res.status(response?.status).json({
      upcomingBookings: response?.upcomingBookings,
      assignedBookings: response?.assignedBookings,
      status: response?.status,
      message: response?.message,
    });
  } catch (error) {
    console.log("ERROR FROM DECLINE BOOKING:", error);
    return res.status(500).json({ message: internalServerError, error });
  }
};

// GET vendor earnings
export const getVendorEarnings = async (req, res) => {
  const { vendorId } = req.params;

  try {
    // Reject booking
    const response = await vendorService.getVendorEarnings(vendorId);

    // Return a response
    return res.status(response?.status).json({
      earnings: response?.earnings,
      expectedEarnings: response?.expectedEarnings,
      status: response?.status,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Start booking
export const startBooking = async (req, res) => {
  const { vendorId, bookingId } = req.params;

  try {
    // Start booking
    const response = await vendorService.startBooking(vendorId, bookingId);

    // Return a response
    return res.status(response?.status).json({
      upcomingBookings: response?.upcomingBookings,
      assignedBookings: response?.assignedBookings,
      ongoingBookings: response?.ongoingBookings,
      status: response?.status,
      message: response?.message,
    });
  } catch (error) {
    console.log("ERROR FROM ACCEPT BOOKING:", error);
    return res.status(500).json({ message: internalServerError });
  }
};

// End booking
export const endBooking = async (req, res) => {
  const { vendorId, bookingId } = req.params;

  try {
    // End booking
    const response = await vendorService.endBooking(vendorId, bookingId);

    // Return a response
    return res.status(response?.status).json({
      upcomingBookings: response?.upcomingBookings,
      assignedBookings: response?.assignedBookings,
      ongoingBookings: response?.ongoingBookings,
      completedBookings: response?.completedBookings,
      status: response?.status,
      message: response?.message,
    });
  } catch (error) {
    console.log("ERROR FROM ACCEPT BOOKING:", error);
    return res.status(500).json({ message: internalServerError });
  }
};

// Create vendor driver
export const createVendorDriver = async (req, res) => {
  try {
    // Create driver
    const response = await vendorService.signupVendorDriver(req.body);

    // Return a response
    return res.status(response?.status).json({
      status: response?.status,
      message: response?.message,
      vendorDriver: response?.vendorDriver,
      vendorDrivers: response?.vendorDrivers,
    });
  } catch (error) {
    console.log("ERROR FROM ACCEPT BOOKING:", error);
    return res.status(500).json({ message: internalServerError });
  }
};

// Create vendor car
export const createVendorCar = async (req, res) => {
  try {
    // Create car
    const response = await vendorService.createFleet(req.body);

    // Return a response
    return res.status(response?.status).json({
      status: response?.status,
      message: response?.message,
      newFleet: response?.newFleet,
      vendorFleet: response?.updatedVendorFleet,
    });
  } catch (error) {
    console.log("ERROR FROM ACCEPT BOOKING:", error);
    return res.status(500).json({ message: internalServerError });
  }
};

// GET vendor drivers
export const getVendorDrivers = async (req, res) => {
  try {
    // Fetch vendor drivers
    const response = await vendorService.getVendorDrivers();

    // Return a response
    return res.status(response?.status).json({
      vendorDrivers: response?.vendorDrivers,
      status: response?.status,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// GET vendor fleet
export const getVendorFleet = async (req, res) => {
  try {
    // Fetch vendor fleet
    const response = await vendorService.getVendorFleet();

    // Return a response
    return res.status(response?.status).json({
      vendorFleet: response?.vendorFleet,
      status: response?.status,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};
