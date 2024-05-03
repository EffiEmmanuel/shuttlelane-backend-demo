// @ts-nocheck
import CityModel from "../model/city.model.js";
import CurrencyModel from "../model/currency.model.js";
import { validateFields } from "../util/auth.helper.js";
import { convertAmountToUserCurrency } from "../util/index.js";

export default class CarService {
  constructor(ShuttlelaneCarModel) {
    this.CarModel = ShuttlelaneCarModel;
  }

  // This service CREATES a new car
  async createCar(city, name, price) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([city, name, price]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    const carExists = await this.CarModel.findOne({
      city,
      name,
    }).populate("city");

    console.log("CAR EXISTS:", carExists);
    console.log("CITY:", city);

    if (carExists) {
      return {
        status: 409,
        message: `This car already exists in the ${carExists?.city?.name}. Try adding a class with a different name.`,
      };
    }
    const cityExists = await CityModel.findOne({
      _id: city,
    });

    if (!cityExists) {
      return {
        status: 409,
        message: `The specified city does not exist! Try creating a city with that name before proceeding.`,
      };
    }

    const newCar = await this.CarModel.create({
      city,
      name,
      price,
    });

    // Update city document to include the just created car
    cityExists?.cars?.push(newCar?._id);
    await cityExists.save();

    // Fetch updated city (So the frontend can be update without having to refresh the page & to prevent making another request to get them)
    const updatedCity = await CityModel.find({ _id: city }).populate("cars");

    return {
      status: 201,
      message: `Car created successfully!`,
      updatedCity: updatedCity,
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
  async updateCar(carId, values, cityId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([carId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any car exists with the _id
    const car = await this.CarModel.findOneAndUpdate(
      {
        _id: carId,
        city: cityId,
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

    const updatedCity = await CityModel.find({ _id: city }).populate("cars");

    return {
      status: 201,
      message: `Car updated successfully.`,
      updatedCity: updatedCity,
    };
  }

  // This service DELETES a car
  async deleteCar(carId, cityId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([carId, cityId]);

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

    // Delete car from city
    const city = await CityModel.findOne({ _id: cityId });
    city.cars = city?.cars?.filter((car) => car !== carId);
    await city.save();

    const cars = await this.CarModel.find({}).sort({
      createdAt: -1,
    });

    const updatedCity = await CityModel.find({ _id: city }).populate("cars");

    return {
      status: 201,
      message: `Car deleted successfully.`,
      updatedCity: updatedCity,
    };
  }
}
