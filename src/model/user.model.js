import mongoose from "mongoose";

// SCHEMA: This schema is for Users
const userSchema = new mongoose.Schema(
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

    countryCode: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    bookings: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Booking",
      },
    ],

    phoneVerification: {
      type: mongoose.Types.ObjectId,
      ref: "Verification",
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
