import { validateFields } from "../util/auth.helper.js";

export default class VehicleClassService {
  constructor(ShuttlelaneVehicleClassModel) {
    this.VehicleClassModel = ShuttlelaneVehicleClassModel;
  }

  // This service CREATES a new vehicle class
  async createVehicleClass(image, className, passengers, luggages, basePrice) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([
      image,
      className,
      passengers,
      luggages,
      basePrice,
    ]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    const vehicleClassExists = await this.VehicleClassModel.findOne({
      className,
    });

    if (vehicleClassExists) {
      return {
        status: 409,
        message:
          "This vehicle class already exists. Try adding a class with a different name.",
      };
    }

    const newVehicleClass = await this.VehicleClassModel.create({
      image,
      className,
      passengers,
      luggages,
      basePrice,
    });

    // Fetch all vehicle classes (So the frontend can be update without having to refresh the page & to prevent making another request to get them)
    const vehicleClasses = await this.VehicleClassModel.find().sort({
      createdAt: -1,
    });

    return {
      status: 201,
      message: `Vehicle class created successfully!`,
      vehicleClasses: vehicleClasses,
    };
  }

  // This service fetches all vehicle classes
  async getVehicleClasses() {
    const vehicleClasses = await this.VehicleClassModel.find({});

    // Return a response
    return {
      status: 200,
      message: `Vehicle classes fetched`,
      vehicleClasses: vehicleClasses,
    };
  }

  // This service fetches a vehicle class
  async getVehicleClass(vehicleClassId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([vehicleClassId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    const vehicleClass = await this.VehicleClassModel.findOne({
      _id: vehicleClassId,
    });

    // Return a response
    return {
      status: 200,
      message: `Vehicle class fetched`,
      vehicleClass: vehicleClass,
    };
  }

  // This service UPDATES a vehicle class
  async updateVehicleClass(vehicleClassId, values) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([vehicleClassId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any vehicleClass exists with the _id
    const vehicleClass = await this.VehicleClassModel.findOneAndUpdate(
      {
        _id: vehicleClassId,
      },
      { ...values }
    );

    if (!vehicleClass) {
      return {
        status: 404,
        message: `No vehicleClass with _id ${vehicleClassId} exists.`,
      };
    }

    const vehicleClasses = await this.VehicleClassModel.find({}).sort({
      createdAt: -1,
    });

    return {
      status: 201,
      message: `Vehicle class updated successfully.`,
      vehicleClasses: vehicleClasses,
    };
  }

  // This service DELETES a vehicle class
  async deleteVehicleClass(vehicleClassId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([vehicleClassId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any vehicleClass exists with the _id
    const vehicleClass = await this.VehicleClassModel.findOneAndRemove({
      _id: vehicleClassId,
    });

    if (!vehicleClass) {
      return {
        status: 404,
        message: `No vehicleClass with _id ${vehicleClassId} exists.`,
      };
    }

    const vehicleClasses = await this.VehicleClassModel.find({}).sort({
      createdAt: -1,
    });

    return {
      status: 201,
      message: `Vehicle class deleted successfully.`,
      vehicleClasses: vehicleClasses,
    };
  }
}
