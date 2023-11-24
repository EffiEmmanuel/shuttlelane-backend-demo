import CarModel from "../model/car.model.js";
import CarService from "../service/CarService.js";

// Generic messages
const internalServerError =
  "An error occured while we processed your request. Please try again.";

// SERVICE INSTANCES
// Create a new carService instance
const carService = new CarService(CarModel);

// CARS
// Get Cars
export const fetchCars = async (req, res) => {
  try {
    // Fetch cars
    const response = await carService.getCars();

    // Return a response
    return res.status(response?.status).json({
      cars: response?.cars ?? null,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};
