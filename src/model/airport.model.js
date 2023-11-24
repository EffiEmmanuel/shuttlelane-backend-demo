import mongoose from "mongoose";

// SCHEMA: This schema is for Airports on Shuttlelane
const airportSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const AirportModel = mongoose.model("Airport", airportSchema);

export default AirportModel;
