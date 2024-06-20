import express from "express";
import { verifyUserToken } from "../util/auth.helper.js";
import {
  addAirportToCity,
  approveDriverAccount,
  assignDriverToJob,
  approveVendorAccount,
  createBlogPost,
  createCar,
  createCity,
  createCurrency,
  createPass,
  createVehicleClass,
  createVisaOnArrivalRate,
  deleteBlogPost,
  deleteCar,
  deleteCurrency,
  deleteDriverById,
  deleteEnquiryById,
  deletePass,
  deleteUserById,
  deleteVehicleClass,
  deleteVendorById,
  deleteVisaOnArrivalRate,
  fetchUpcomingBookings,
  fetchBookingsAwaitingAssignment,
  fetchCurrencies,
  fetchVisaOnArrivalBaseFees,
  fetchVisaOnArrivalRates,
  getCities,
  getCity,
  getDriverById,
  getDrivers,
  getEnquiries,
  getEnquiryById,
  getStatistics,
  getUserById,
  getUsers,
  getVendorById,
  getVendors,
  markEnquiryAsRead,
  markEnquiryAsUnread,
  sendBulkEmail,
  setRatePerMile,
  setVisaOnArrivalBaseRates,
  updateBlogPost,
  updateCar,
  updateCurrency,
  updatePass,
  updateVehicleClass,
  updateVisaOnArrivalRate,
  getApprovedDrivers,
  getAdminAccounts,
  deleteAdminById,
  getApprovedVendors,
  getAllBookings,
  updateCity,
  deleteCity,
  fetchRatesPerMile,
  deleteRatePerMile,
  rejectVendorAccount,
  suspendVendorAccount,
  unsuspendVendorAccount,
  fetchSuspendVendorAccounts,
  rejectDriverAccount,
  fetchSuspendDriverAccounts,
  suspendDriverAccount,
  unsuspendDriverAccount,
  getUnapprovedVendors,
  getUnapprovedDrivers,
} from "../controller/admin.controller.js";

const adminRouter = express.Router();

// Routes
// GET ADMIN ACCOUNTS
adminRouter.get("/", verifyUserToken, getAdminAccounts);
// DELETE ADMIN ACCOUNT
adminRouter.delete("/:adminId", verifyUserToken, deleteAdminById);

// GET STATISTICS
adminRouter.get("/statistics", verifyUserToken, getStatistics);
// GET ALL BOOKINGS
adminRouter.get("/bookings", verifyUserToken, getAllBookings);
// GET UPCOMING BOOKINGS
adminRouter.get("/bookings/upcoming", verifyUserToken, fetchUpcomingBookings);
// GET BOOKINGS AWAITING ASSIGNMENT
adminRouter.get(
  "/bookings/unassigned",
  verifyUserToken,
  fetchBookingsAwaitingAssignment
);

// CITIES
// Create City
adminRouter.post("/cities", verifyUserToken, createCity);
// Fetch Cities
adminRouter.get("/cities", verifyUserToken, getCities);
// Add Airport To City
adminRouter.post("/cities/add-airport", verifyUserToken, addAirportToCity);
// Fetch City
adminRouter.get("/cities/:cityId", getCity);
// Update City
adminRouter.patch("/cities/update/:cityId", updateCity);
// Delete City
adminRouter.delete("/cities/delete/:cityId", deleteCity);

// USERS
// Fetch Users
adminRouter.get("/users", verifyUserToken, getUsers);
// Fetch User by id
adminRouter.get("/users/:userId", verifyUserToken, getUserById);
// Delete User by id
adminRouter.delete("/users/delete/:userId", verifyUserToken, deleteUserById);

// DRIVERS
// Fetch Drivers
adminRouter.get("/drivers", verifyUserToken, getDrivers);
// Fetch Approved Drivers
adminRouter.get("/drivers/approved", verifyUserToken, getApprovedDrivers);
// Fetch Unapproved Drivers
adminRouter.get("/drivers/unapproved", verifyUserToken, getUnapprovedDrivers);
// Fetch Driver by id
adminRouter.get("/drivers/:driverId", verifyUserToken, getDriverById);
// Approve Driver account
adminRouter.patch(
  "/drivers/:driverId/account/approve",
  verifyUserToken,
  approveDriverAccount
);
// Reject Driver account
adminRouter.patch(
  "/drivers/:driverId/account/reject",
  verifyUserToken,
  rejectDriverAccount
);
// Fetch Suspended Driver accounts
adminRouter.get(
  "/drivers/account/suspended-accounts",
  verifyUserToken,
  fetchSuspendDriverAccounts
);
// Suspend Driver account
adminRouter.patch(
  "/drivers/:driverId/account/suspend",
  verifyUserToken,
  suspendDriverAccount
);
// Unsuspend Driver account
adminRouter.patch(
  "/drivers/:driverId/account/unsuspend",
  verifyUserToken,
  unsuspendDriverAccount
);
// Assign Driver to a booking
adminRouter.patch(
  "/assign-to-booking/:userType/:userId/:bookingId",
  verifyUserToken,
  assignDriverToJob
);
// Delete Driver by id
adminRouter.delete(
  "/drivers/delete/:driverId",
  verifyUserToken,
  deleteDriverById
);

// VENDORS
// Fetch vendors
adminRouter.get("/vendors", verifyUserToken, getVendors);
// Fetch Approved Vendors
adminRouter.get("/vendors/approved", verifyUserToken, getApprovedVendors);
// Fetch Unapproved Vendors
adminRouter.get("/vendors/unapproved", verifyUserToken, getUnapprovedVendors);
// Fetch Vendor by id
adminRouter.get("/vendors/:vendorId", verifyUserToken, getVendorById);
// Approve Vendor account
adminRouter.patch(
  "/vendors/:vendorId/account/approve",
  verifyUserToken,
  approveVendorAccount
);
// Reject Vendor account
adminRouter.patch(
  "/vendors/:vendorId/account/reject",
  verifyUserToken,
  rejectVendorAccount
);
// Fetch Suspended Vendor accounts
adminRouter.get(
  "/vendors/account/suspended-accounts",
  verifyUserToken,
  fetchSuspendVendorAccounts
);
// Suspend Vendor account
adminRouter.patch(
  "/vendors/:vendorId/account/suspend",
  verifyUserToken,
  suspendVendorAccount
);
// Unsuspend Vendor account
adminRouter.patch(
  "/vendors/:vendorId/account/unsuspend",
  verifyUserToken,
  unsuspendVendorAccount
);
// Delete Vendor by id
adminRouter.delete(
  "/vendors/delete/:vendorId",
  verifyUserToken,
  deleteVendorById
);

// ENQUIRIES
// Fetch enquiries
adminRouter.get("/enquiries", verifyUserToken, getEnquiries);
// Fetch Enquiry by id
adminRouter.get("/enquiries/:enquiryId", verifyUserToken, getEnquiryById);
// Mark Enquiry as read
adminRouter.patch(
  "/enquiries/:enquiryId/mark-as-read",
  verifyUserToken,
  markEnquiryAsRead
);
// Mark Enquiry as unread
adminRouter.patch(
  "/enquiries/:enquiryId/mark-as-unread",
  verifyUserToken,
  markEnquiryAsUnread
);
// Delete Enquiry by id
adminRouter.delete(
  "/enquiries/delete/:enquiryId",
  verifyUserToken,
  deleteEnquiryById
);

// BULK EMAIL
adminRouter.post("/broadcasts/bulk-email", verifyUserToken, sendBulkEmail);

// CURRENCIES / RATES
adminRouter.get("/currencies", verifyUserToken, fetchCurrencies);
adminRouter.post("/currencies/create-new", verifyUserToken, createCurrency);
adminRouter.put("/currencies/:_id", verifyUserToken, updateCurrency);
adminRouter.delete("/currencies/:_id", verifyUserToken, deleteCurrency);

// RATE PER MILE
// Set rate per mile
adminRouter.post("/rate-per-mile", verifyUserToken, setRatePerMile);
adminRouter.delete("/rate-per-mile/:_id", verifyUserToken, deleteRatePerMile);
adminRouter.get("/rate-per-mile", verifyUserToken, fetchRatesPerMile);

// VISA ON ARRIVAL RATES
// Get all visa on arrival rates / countries
adminRouter.get(
  "/visa-on-arrival-rates",
  verifyUserToken,
  fetchVisaOnArrivalRates
);
// Create visa on arrival rates
adminRouter.post(
  "/visa-on-arrival-rates",
  verifyUserToken,
  createVisaOnArrivalRate
);
// Update visa on arrival rates
adminRouter.put(
  "/visa-on-arrival-rates/:_id",
  verifyUserToken,
  updateVisaOnArrivalRate
);
// Delete visa on arrival rates
adminRouter.delete(
  "/visa-on-arrival-rates/:_id",
  verifyUserToken,
  deleteVisaOnArrivalRate
);

// VOA BASE FEES
// GET visa on arrival BASE fees
adminRouter.get(
  "/visa-on-arrival-rates/base",
  verifyUserToken,
  fetchVisaOnArrivalBaseFees
);
// Set visa on arrival BASE rates
adminRouter.post(
  "/visa-on-arrival-rates/base",
  verifyUserToken,
  setVisaOnArrivalBaseRates
);

// VEHICLE CLASSES
// CREATE vehicle class
adminRouter.post("/vehicle-classes", verifyUserToken, createVehicleClass);
// UPDATE vehicle class
adminRouter.put(
  "/vehicle-classes/:_id/:cityId",
  verifyUserToken,
  updateVehicleClass
);
// DELETE vehicle class
adminRouter.delete(
  "/vehicle-classes/:_id/:cityId",
  verifyUserToken,
  deleteVehicleClass
);

// CARS
// CREATE car
adminRouter.post("/cars", verifyUserToken, createCar);
// UPDATE car
adminRouter.put("/cars/:_id/:cityId", verifyUserToken, updateCar);
// DELETE car
adminRouter.delete("/cars/:_id/:cityId", verifyUserToken, deleteCar);

// PASSES
// CREATE pass
adminRouter.post("/passes", verifyUserToken, createPass);
// UPDATE pass
adminRouter.put("/passes/:_id", verifyUserToken, updatePass);
// DELETE pass
adminRouter.delete("/passes/:_id", verifyUserToken, deletePass);

// BLOG
// CREATE blog post
adminRouter.post("/blog-posts", verifyUserToken, createBlogPost);
// UPDATE blog post
adminRouter.put("/blog-posts/:_id", verifyUserToken, updateBlogPost);
// DELETE blog post
adminRouter.delete("/blog-posts/:_id", verifyUserToken, deleteBlogPost);

export default adminRouter;
