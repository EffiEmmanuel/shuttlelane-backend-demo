import mongoose from "mongoose";

// SCHEMA: This schema is for Enquiries sent from the "Get in touch" page on shuttlelane.com
const enquirySchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const EnquiryModel = mongoose.model("Enquiry", enquirySchema);

export default EnquiryModel;
