import mongoose from "mongoose";

// SCHEMA: This schema is for Drivers
const citySchema = new mongoose.Schema(
  {
    cityName: {
      type: String,
      required: true,
    },

    airports: [{}],

    vehicleClasses: [
      {
        type: mongoose.Types.ObjectId,
        ref: "VehicleClass",
      },
    ],
  },
  { timestamps: true }
);

const CityModel = mongoose.model("City", citySchema);

export default CityModel;
