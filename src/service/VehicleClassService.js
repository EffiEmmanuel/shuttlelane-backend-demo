import CityModel from "../model/city.model.js";
import CurrencyModel from "../model/currency.model.js";
import { validateFields } from "../util/auth.helper.js";
import { convertAmountToUserCurrency } from "../util/index.js";

export default class VehicleClassService {
  constructor(ShuttlelaneVehicleClassModel) {
    this.VehicleClassModel = ShuttlelaneVehicleClassModel;
  }

  // This service CREATES a new vehicle class
  async createVehicleClass(
    image,
    className,
    description,
    passengers,
    luggages,
    basePrice,
    cityId
  ) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([
      image,
      className,
      description,
      passengers,
      luggages,
      basePrice,
      cityId,
    ]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if city exists
    const cityExists = await CityModel.findOne({ _id: cityId });
    if (!cityExists)
      return {
        status: 404,
        message: "No city exists with the id specified",
      };

    // Create the vehicle class
    const newVehicleClass = await this.VehicleClassModel.create({
      image,
      className,
      description,
      passengers,
      luggages,
      basePrice,
    });

    // Check if the vehicleClassId is already present in the array
    if (cityExists.vehicleClasses.includes(newVehicleClass?._id)) {
      return {
        status: 400,
        message: "Vehicle class already exists in the city",
      };
    }

    // Add the vehicleClassId to the vehicleClasses array
    cityExists.vehicleClasses.push(newVehicleClass?._id);
    await cityExists.save();

    // Fetch all vehicle classes (So the frontend can be update without having to refresh the page & to prevent making another request to get them)
    const vehicleClasses = await this.VehicleClassModel.find().sort({
      createdAt: -1,
    });

    return {
      status: 201,
      message: `Vehicle class created and added to city successfully!`,
      vehicleClasses: vehicleClasses,
    };
  }

  // This service fetches all vehicle classes
  async getVehicleClasses(userCountry, isAdminRequest) {
    const vehicleClasses = await this.VehicleClassModel.find({});
    console.log("HELLO HELLO::", isAdminRequest);
    if (isAdminRequest) {
      // Return a response
      return {
        status: 200,
        message: `Vehicle classes fetched`,
        vehicleClasses: vehicleClasses,
      };
    }

    // Get currency (UPDATE LATER TO INCLUDE MORE THAN ONE COUNTRY) where the userCountry is listed
    const allowedCurrency = await CurrencyModel.findOne({
      supportedCountries: { $in: [userCountry] },
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log("ERROR:", err);
      });

    // Check if the user's country has been added to a currency
    if (allowedCurrency) {
      let vehicleClassesWithConvertedRates = [];

      for (let i = 0; i < vehicleClasses?.length; i++) {
        let convertedRate = convertAmountToUserCurrency(
          allowedCurrency,
          vehicleClasses[i]?.basePrice
        );
        vehicleClasses[i].basePrice = convertedRate;
        vehicleClassesWithConvertedRates.push(vehicleClasses[i]);
      }

      // Return a response
      return {
        status: 200,
        message: `Vehicle classes fetched`,
        vehicleClasses: vehicleClassesWithConvertedRates,
        currency: allowedCurrency,
      };
    } else {
      // Default to Naira
      const userCurrency = await CurrencyModel.findOne({ symbol: "₦" });

      // Return a response
      return {
        status: 200,
        message: `Vehicle classes fetched`,
        vehicleClasses: vehicleClasses,
        currency: userCurrency,
      };
    }
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

    const cities = await CityModel.find({}).populate('vehicleClasses');

    return {
      status: 201,
      message: `Vehicle class updated successfully.`,
      vehicleClasses: vehicleClasses,
      cities: cities,
    };
  }

  // This service DELETES a vehicle class
  async deleteVehicleClassFromCity(cityId, vehicleClassId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([cityId, vehicleClassId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    const city = await CityModel.findById(cityId);
    if (!city) {
      return { status: 400, message: "City not found" };
    }

    // Check if the vehicleClassId is present in the array
    if (!city.vehicleClasses.includes(vehicleClassId)) {
      return {
        status: 400,
        message: "Vehicle class does not exist in the city",
      };
    }

    // Remove the vehicleClassId from the vehicleClasses array
    city.vehicleClasses = city.vehicleClasses.filter(
      (id) => id.toString() !== vehicleClassId
    );
    await city.save();

    // delete vehicle class from vehicle class schema
    await this.VehicleClassModel.findOneAndRemove({ _id: vehicleClassId })

    const updatedCity = await CityModel.findOne({ _id: cityId }).sort({
      createdAt: -1,
    }).populate("vehicleClasses");

    return {
      status: 201,
      message: `Vehicle class deleted successfully.`,
      updatedCity: updatedCity,
    };
  }
}
