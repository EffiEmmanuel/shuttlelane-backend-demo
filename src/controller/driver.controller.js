import DriverModel from "../model/driver.model.js";
import DriverService from "../service/DriverService.js";

// Generic messages
const internalServerError =
  "An error occured while we processed your request. Please try again.";

// SERVICE INSTANCES
// Create a new DriverService instance
const driverService = new DriverService(DriverModel);

// Sign up driver
export const signupDriver = async (req, res) => {
  console.log("HI");
  console.log("DRIVER 111:", req.body);
  try {
    // Create new driver
    const response = await driverService.signupDriver({
      ...req.body,
    });

    // return a response
    if (response?.status !== 201) {
      return res.status(response?.status).json({ message: response?.message });
    }

    return res.status(response?.status).json({
      message: response?.message,
      token: response?.token,
      driver: response?.driver,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ message: internalServerError, error });
  }
};

// Log in driver
export const loginDriver = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Log in driver
    const response = await driverService.loginDriver(email, password);

    // return a response
    if (response?.status !== 200) {
      return res.status(response?.status).json({ message: response?.message });
    }

    return res.status(response?.status).json({
      message: response?.message,
      token: response?.token,
      driver: response?.driver,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get driver by email
export const getDriverByEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Fetch driver
    const response = await driverService.getDriverByEmail(email);
    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get driver by id
export const getDriverById = async (req, res) => {
  const { driverId } = req.params;

  try {
    // Fetch driver
    const response = await driverService.getDriverById(driverId);

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get drivers
// TO-DO: Transfer to admin controller
export const getDrivers = async (req, res) => {
  try {
    // Fetch drivers
    const drivers = await driverService.getDrivers();

    // Return a response
    return res
      .status(drivers?.status)
      .json({ drivers: drivers?.driver ?? null, message: drivers?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Delete driver by email
export const deleteDriverByEmail = async (req, res) => {
  const { email } = req.body;
  try {
    // DELETE driver
    const response = await driverService.deleteDriverByEmail(email);

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Delete driver by id
export const deleteDriverById = async (req, res) => {
  const { driverId } = req.params;
  try {
    // DELETE driver
    const response = await driverService.deleteDriverById(driverId);

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Update driver by id
export const updateDriverById = async (req, res) => {
  const { driverId } = req.params;

  try {
    // UPDATE driver
    const response = await driverService.updateDriverById(
      driverId,
      ...req.body
    );

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get driver total spend by driver id
export const getDriverTotalSpendByDriverId = async (req, res) => {
  const { driverId } = req.params;

  try {
    // Fetch driver
    const response = await driverService.getDriverTotalSpendByDriverId(
      driverId
    );

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get driver bookings by driver id
export const getDriverBookingsByDriverId = async (req, res) => {
  const { driverId } = req.params;

  try {
    // Fetch driver
    const response = await driverService.getDriverBookingsByDriverId(driverId);

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};
