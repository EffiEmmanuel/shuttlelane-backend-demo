import mongoose from "mongoose";

// SCHEMA: This schema is for Priority Pass (Standard and Premium Pass). It is different from the Priority Pass BOOKING schema
const priorityPassSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    price: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const PriorityPassModel = mongoose.model("PriorityPass", priorityPassSchema);

export default PriorityPassModel;
