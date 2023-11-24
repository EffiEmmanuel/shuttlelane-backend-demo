import VehicleClassModel from "../model/vehicleClass.model.js";
import VehicleClassService from "../service/VehicleClassService.js";

// Generic messages
const internalServerError =
  "An error occured while we processed your request. Please try again.";

// SERVICE INSTANCES
// Create a new VehicleClassService instance
const vehicleClassService = new VehicleClassService(VehicleClassModel);

// VEHICLE CLASSES
// Get vehicle classes
export const fetchVehicleClasses = async (req, res) => {
  try {
    // Fetch vehicle classes
    const response = await vehicleClassService.getVehicleClasses();

    // Return a response
    return res.status(response?.status).json({
      vehicleClasses: response?.vehicleClasses ?? null,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};
