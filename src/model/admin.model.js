import mongoose from "mongoose";

// SCHEMA: This schema is for the Admin
const adminSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },

    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      match: /.+\@.+\..+/,
      required: true,
    },

    username: {
      type: String,
      trim: true,
      required: true,
    },

    password: {
      type: String,
      //   required: true,
    },

    role: {
      type: String,
      required: true,
      default: "Blogger",
      enum: ["Super Admin", "Blogger"],
    },
  },
  { timestamps: true }
);

const AdminModel = mongoose.model("Admin", adminSchema);

export default AdminModel;
