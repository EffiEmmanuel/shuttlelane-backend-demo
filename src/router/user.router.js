import express from "express";
import { verifyUserToken } from "../util/auth.helper.js";
import {
  deleteUserById,
  deleteUserByEmail,
  getUserByEmail,
  getUserById,
  loginUser,
  signupUser,
  getUserTotalSpendByUserId,
  getUserBookingsByUserId,
  updateUserById,
  getCities,
  getVisaOnArrivalRates,
  getVisaOnArrivalRatesWithNigerianVisa,
  sendEnquiryEmail,
  createPayment,
  getBookingById,
} from "../controller/user.controller.js";

const userRouter = express.Router();

// Routes
// SIGNUP USER
userRouter.post("/signup", signupUser);
// LOGIN USER
userRouter.post("/login", loginUser);
// GET USER BY EMAIL
userRouter.get("/get-user-by-email", verifyUserToken, getUserByEmail);
// GET USER BY ID
userRouter.get("/get-user/:userId", verifyUserToken, getUserById);
// GET USER BOOKINGS BY USER ID
userRouter.patch("/bookings/:userId", verifyUserToken, getUserBookingsByUserId);
// GET BOOKING BY ID
userRouter.get("/booking/:bookingId", getBookingById);
// GET USER SPEND BY USER ID
userRouter.get(
  "/total-spend/:userId",
  verifyUserToken,
  getUserTotalSpendByUserId
);
// UPDATE USER BY USER ID
userRouter.patch("/update-user/:userId", verifyUserToken, updateUserById);
// DELETE USER BY EMAIL
userRouter.delete("/delete-user-by-email", verifyUserToken, deleteUserByEmail);
// DELETE USER BY ID
userRouter.delete("/delete-user/:userId", verifyUserToken, deleteUserById);

// CITIES
// Get Cities
userRouter.get("/cities", getCities);

// VISA ON ARRIVAL RATES
// Get Visa On Arrival Rates
userRouter.get("/voaRates", getVisaOnArrivalRates);
// Get Visa On Arrival Rates With Nigerian Visa Requirement
userRouter.get(
  "/voaRatesWithNigerianVisa",
  getVisaOnArrivalRatesWithNigerianVisa
);

// ENQUIRIES
// Send Enquiry Email
userRouter.post("/enquiries/sendMessage", sendEnquiryEmail);

// PAYMENTS
// Create payment
userRouter.post("/payments", createPayment);

export default userRouter;
