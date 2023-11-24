import mongoose from "mongoose";

/* SCHEMA: This schema is for cars (eg. Toyota Camry 2019). It is different from the "Vehicle Class"
   schema (Economy, Business and so on)
 */
const carSchema = new mongoose.Schema({
  name: { type: String, required: true },

  price: { type: String, required: true },
});

const CarModel = mongoose.model("Car", carSchema);

export default CarModel;
