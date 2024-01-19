import mongoose from "mongoose";

/* SCHEMA: This schema is for "Vehicle Class" schema (Economy, Business and so on)
 */
const vehicleClassSchema = new mongoose.Schema({
  image: { type: String, required: true },

  className: { type: String, required: true },

  description: { type: String, required: true },

  passengers: { type: String, required: true },

  luggages: { type: String, required: true },

  basePrice: { type: String, required: true }, // The default prices are in Naira (NGN)
});

const VehicleClassModel = mongoose.model("VehicleClass", vehicleClassSchema);

export default VehicleClassModel;
