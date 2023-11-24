import { validateFields } from "../util/auth.helper.js";

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
  async getPasses() {
    const passes = await this.PriorityPassModel.find({});

    // Return a response
    return {
      status: 200,
      message: `Passes fetched`,
      passes: passes,
    };
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
