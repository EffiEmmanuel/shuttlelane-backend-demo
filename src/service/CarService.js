import CurrencyModel from "../model/currency.model.js";
import { validateFields } from "../util/auth.helper.js";
import { convertAmountToUserCurrency } from "../util/index.js";

export default class CarService {
  constructor(ShuttlelaneCarModel) {
    this.CarModel = ShuttlelaneCarModel;
  }

  // This service CREATES a new car
  async createCar(name, price) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([name, price]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    const carExists = await this.CarModel.findOne({
      name,
    });

    if (carExists) {
      return {
        status: 409,
        message:
          "This car already exists. Try adding a class with a different name.",
      };
    }

    const newCar = await this.CarModel.create({
      name,
      price,
    });

    // Fetch all cars (So the frontend can be update without having to refresh the page & to prevent making another request to get them)
    const cars = await this.CarModel.find().sort({
      createdAt: -1,
    });

    return {
      status: 201,
      message: `Car created successfully!`,
      cars: cars,
    };
  }

  // This service fetches all cars
  async getCars(userCountry, isAdminRequest) {
    const cars = await this.CarModel.find({});

    console.log("HELLO HELLO::", isAdminRequest);
    if (isAdminRequest) {
      // Return a response
      return {
        status: 200,
        message: `Cars fetched`,
        cars: cars,
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
      let carsWithConvertedRates = [];

      for (let i = 0; i < cars?.length; i++) {
        let convertedRate = await convertAmountToUserCurrency(
          allowedCurrency,
          cars[i]?.price
        );
        cars[i].price = convertedRate;
        carsWithConvertedRates.push(cars[i]);
      }

      // Return a response
      return {
        status: 200,
        message: `Cars fetched`,
        cars: carsWithConvertedRates,
        currency: allowedCurrency,
      };
    } else {
      // Default to naira
      const currency = await CurrencyModel.findOne({
        currencyLabel: "Naira",
      });

      let carsWithConvertedRates = [];

      for (let i = 0; i < cars?.length; i++) {
        let convertedRate = await convertAmountToUserCurrency(
          allowedCurrency,
          cars[i]?.price
        );

        cars[i].price = convertedRate;
        carsWithConvertedRates.push(cars[i]);
      }

      // Return a response
      return {
        status: 200,
        message: `Cars fetched`,
        cars: carsWithConvertedRates,
        currency: currency,
      };
    }
  }

  // This service fetches a car
  async getCar(carId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([carId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    const car = await this.CarModel.findOne({
      _id: carId,
    });

    // Return a response
    return {
      status: 200,
      message: `Car fetched`,
      car: car,
    };
  }

  // This service UPDATES a car
  async updateCar(carId, values) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([carId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any car exists with the _id
    const car = await this.CarModel.findOneAndUpdate(
      {
        _id: carId,
      },
      { ...values }
    );

    if (!car) {
      return {
        status: 404,
        message: `No car with _id ${carId} exists.`,
      };
    }

    const cars = await this.CarModel.find({}).sort({
      createdAt: -1,
    });

    return {
      status: 201,
      message: `Car updated successfully.`,
      cars: cars,
    };
  }

  // This service DELETES a car
  async deleteCar(carId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([carId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any car exists with the _id
    const car = await this.CarModel.findOneAndRemove({
      _id: carId,
    });

    if (!car) {
      return {
        status: 404,
        message: `No car with _id ${carId} exists.`,
      };
    }

    const cars = await this.CarModel.find({}).sort({
      createdAt: -1,
    });

    return {
      status: 201,
      message: `Car deleted successfully.`,
      cars: cars,
    };
  }
}
