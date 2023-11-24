import mongoose from "mongoose";

// SCHEMA: This schema is for visa on arrival base fees -These fees are the same across all countries on a visa on arrival application
const voaBaseFeeSchema = new mongoose.Schema(
  {
    transactionFee: {
      type: String,
      required: true,
    },

    processingFee: {
      type: String,
      required: true,
    },

    biometricFee: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const VoaBaseFeesModel = mongoose.model("voaBaseFee", voaBaseFeeSchema);

export default VoaBaseFeesModel;
