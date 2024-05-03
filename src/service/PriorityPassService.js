import CurrencyModel from "../model/currency.model.js";
import { validateFields } from "../util/auth.helper.js";
import { convertAmountToUserCurrency } from "../util/index.js";

export default class PriorityPassService {
  constructor(ShuttlelanePriorityPassModel) {
    this.PriorityPassModel = ShuttlelanePriorityPassModel;
  }

  // This service CREATES a new priority pass
  async createPass(name, price) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([name, price]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    const passExists = await this.PriorityPassModel.findOne({
      name,
    });

    if (passExists) {
      return {
        status: 409,
        message:
          "This pass already exists. Try adding a class with a different name.",
      };
    }

    const newPass = await this.PriorityPassModel.create({
      name,
      price,
    });

    // Fetch all passes (So the frontend can be update without having to refresh the page & to prevent making another request to get them)
    const passes = await this.PriorityPassModel.find().sort({
      createdAt: -1,
    });

    return {
      status: 201,
      message: `Pass created successfully!`,
      passes: passes,
    };
  }

  // This service fetches all passes
  async getPasses(userCountry, isAdminRequest) {
    const passes = await this.PriorityPassModel.find({});

    if (isAdminRequest) {
      // Return a response
      return {
        status: 200,
        message: `Passes fetched`,
        passes: passes,
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
      let passesWithConvertedRates = [];

      for (let i = 0; i < passes?.length; i++) {
        let convertedRate = await convertAmountToUserCurrency(
          allowedCurrency,
          passes[i]?.price
        );
        passes[i].price = convertedRate;
        passesWithConvertedRates.push(passes[i]);
      }

      // Return a response
      return {
        status: 200,
        message: `Passes fetched`,
        passes: passesWithConvertedRates,
        currency: allowedCurrency,
      };
    } else {
      // Default to Naira
      const userCurrency = await CurrencyModel.findOne({ symbol: "₦" });

      // Return a response
      return {
        status: 200,
        message: `Passes fetched`,
        passes: passes,
        currency: userCurrency,
      };
    }
  }

  // This service fetches a pass
  async getPass(passId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([passId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    const pass = await this.PriorityPassModel.findOne({
      _id: passId,
    });

    // Return a response
    return {
      status: 200,
      message: `Pass fetched`,
      pass: pass,
    };
  }

  // This service UPDATES a pass
  async updatePass(passId, values) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([passId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any pass exists with the _id
    const pass = await this.PriorityPassModel.findOneAndUpdate(
      {
        _id: passId,
      },
      { ...values }
    );

    if (!pass) {
      return {
        status: 404,
        message: `No pass with _id ${passId} exists.`,
      };
    }

    const passes = await this.PriorityPassModel.find({}).sort({
      createdAt: -1,
    });

    return {
      status: 201,
      message: `Pass updated successfully.`,
      passes: passes,
    };
  }

  // This service DELETES a pass
  async deletePass(passId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([passId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any pass exists with the _id
    const pass = await this.PriorityPassModel.findOneAndRemove({
      _id: passId,
    });

    if (!pass) {
      return {
        status: 404,
        message: `No pass with _id ${passId} exists.`,
      };
    }

    const passes = await this.PriorityPassModel.find({}).sort({
      createdAt: -1,
    });

    return {
      status: 201,
      message: `Pass deleted successfully.`,
      passes: passes,
    };
  }
}
