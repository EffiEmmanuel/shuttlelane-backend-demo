import express from "express";
import { verifyUserToken } from "../util/auth.helper.js";
import { getPayment, getPayments } from "../controller/admin.controller.js";
import { createStripePaymentIntent } from "../controller/user.controller.js";

const paymentRouter = express.Router();

// Routes
// GET PAYMENTS
paymentRouter.get("/", verifyUserToken, getPayments);
// GET UPCOMING BOOKINGS
paymentRouter.get("/:paymentId", verifyUserToken, getPayment);
// HANDLE STRIPE PAYMENT
paymentRouter.post("/stripe/create-intent", createStripePaymentIntent);

export default paymentRouter;
