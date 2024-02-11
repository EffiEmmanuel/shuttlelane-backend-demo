import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  code: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: "10m" }, // Expire verification codes after 30 minutes
});

const VerificationModel = mongoose.model("Verification", verificationSchema);

export default VerificationModel;
