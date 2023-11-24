import PriorityPassModel from "../model/priorityPass.model.js";
import PriorityPassService from "../service/PriorityPassService.js";

// Generic messages
const internalServerError =
  "An error occured while we processed your request. Please try again.";

// SERVICE INSTANCES
// Create a new priorityPassService instance
const priorityPassService = new PriorityPassService(PriorityPassModel);

// PRIORITY PASSES
// Get Passes
export const fetchPasses = async (req, res) => {
  try {
    // Fetch passes
    const response = await priorityPassService.getPasses();

    // Return a response
    return res.status(response?.status).json({
      passes: response?.passes ?? null,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};
