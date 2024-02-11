import express from "express";
import routes from "../routes.js";
import { loginUser, signupUser } from "../controller/user.controller.js";
import { loginAdmin, signupAdmin } from "../controller/admin.controller.js";
import { verifyJWT } from "../util/auth.helper.js";
import { loginDriver, signupDriver } from "../controller/driver.controller.js";
import { resendOTP, verifyOTP } from "../controller/verification.controller.js";

const authRouter = express.Router();

// Auth routes for Users
// SIGNUP USER
authRouter.post(routes.API_USER_SIGNUP_ROUTE, signupUser);
// LOGIN USER
authRouter.post(routes.API_USER_LOGIN_ROUTE, loginUser);

// Auth routes for Admins
// SIGNUP ADMIN
authRouter.post(routes.API_ADMIN_SIGNUP_ROUTE, signupAdmin);
// LOGIN ADMIN
authRouter.post(routes.API_ADMIN_LOGIN_ROUTE, loginAdmin);

// Auth routes for Drivers
// SIGNUP DRIVER
authRouter.post(routes.API_DRIVER_SIGNUP_ROUTE, signupDriver);
// LOGIN DRIVER
authRouter.post(routes.API_DRIVER_LOGIN_ROUTE, loginDriver);

// Verify Token
authRouter.post("/verify-token", verifyJWT);

// Resend OTP
authRouter.post(`${routes.API_VERIFICATON_ROUTE}/resend-otp`, resendOTP);

// Resend OTP
authRouter.post(`${routes.API_VERIFICATON_ROUTE}/verify-otp`, verifyOTP);
export default authRouter;