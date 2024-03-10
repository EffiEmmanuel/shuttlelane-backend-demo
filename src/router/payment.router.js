import express from "express";
import { verifyUserToken } from "../util/auth.helper.js";
import { getPayment, getPayments } from "../controller/admin.controller.js";

const paymentRouter = express.Router();

// Routes

// GET STATISTICS
paymentRouter.get("/", verifyUserToken, getPayments);
// GET UPCOMING BOOKINGS
paymentRouter.get("/:paymentId", verifyUserToken, getPayment);

export default paymentRouter;
