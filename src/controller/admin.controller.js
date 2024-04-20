import AdminModel from "../model/admin.model.js";
import BlogModel from "../model/blog.model.js";
import BookingModel from "../model/booking.model.js";
import CarModel from "../model/car.model.js";
import PaymentModel from "../model/payment.model.js";
import PriorityPassModel from "../model/priorityPass.model.js";
import VehicleClassModel from "../model/vehicleClass.model.js";
import AdminService from "../service/AdminService.js";
import BlogService from "../service/BlogService.js";
import BookingService from "../service/BookingService.js";
import CarService from "../service/CarService.js";
import PaymentService from "../service/PaymentService.js";
import PriorityPassService from "../service/PriorityPassService.js";
import VehicleClassService from "../service/VehicleClassService.js";

// Generic messages
const internalServerError =
  "An error occured while we processed your request. Please try again.";

// SERVICE INSTANCES
// Create a new AdminService instance
const adminService = new AdminService(AdminModel);
// Create a new VehicleClassService instance
const vehicleClassService = new VehicleClassService(VehicleClassModel);
// Create a new carService instance
const carService = new CarService(CarModel);
// Create a new priorityPassService instance
const priorityPassService = new PriorityPassService(PriorityPassModel);
// Create a new blogService instance
const blogService = new BlogService(BlogModel);
// Create a new paymentService instance
const paymentService = new PaymentService(PaymentModel);
// Create a new bookingService instance
const bookingService = new BookingService(BookingModel);

// Sign up admin
export const signupAdmin = async (req, res) => {
  const { image, firstName, lastName, email, username, role, password } =
    req.body;

  try {
    // Create new admin
    const response = await adminService.signupAdmin({
      firstName,
      lastName,
      email,
      username,
      role,
      //   password,
    });

    // return a response
    if (response?.status !== 201) {
      return res.status(response?.status).json({ message: response?.message });
    }

    return res.status(response?.status).json({
      status: response?.status,
      message: response?.message,
      token: response?.token,
      admin: response?.admin,
      adminAccounts: response?.adminAccounts,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ message: internalServerError, error: error });
  }
};

// Complete admin account signup
export const handleCompleteAdminAccountSignup = async (req, res) => {
  try {
    // Fetch admin accounts
    const response = await adminService.completeAdminAccountSignup({
      _id: req.params?._id,
      image: req.body?.image,
      password: req.body?.password,
    });

    // Return a response
    return res.status(response?.status).json({
      status: response?.status,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get admin accounts
export const getAdminAccounts = async (req, res) => {
  try {
    // Fetch admin accounts
    const response = await adminService.fetchAdminAccounts();

    // Return a response
    return res.status(response?.status).json({
      status: response?.status,
      adminAccounts: response?.adminAccounts,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Log in admin
export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  console.log("req.body:", req.body);
  console.log("username:", username);
  console.log("password:", password);

  console.log("Hi");
  try {
    // Log in admin
    const response = await adminService.loginAdmin(username, password);

    // return a response
    if (response?.status !== 200) {
      return res
        .status(response?.status)
        .json({ message: response?.message, status: response?.status });
    }

    console.log("JWTTTTTTTTTTT:", response?.token);

    return res.status(response?.status).json({
      status: response?.status,
      message: response?.message,
      token: `${response?.token}`,
      admin: response?.admin,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ message: internalServerError });
  }
};

// Get admin by email
export const getAdminByEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Fetch admin
    const response = await adminService.getAdminByEmail(email);
    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get statistics
export const getStatistics = async (req, res) => {
  try {
    // Fetch statistics
    const response = await adminService.getStatistics();

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      numberOfAirportTransferBookings:
        response?.numberOfAirportTransferBookings,
      numberOfCarRentalBookings: response?.numberOfCarRentalBookings,
      numberOfPriorityPassBookings: response?.numberOfPriorityPassBookings,
      numberOfVisaOnArrivalBookings: response?.numberOfVisaOnArrivalBookings,
      users: response?.users,
      drivers: response?.drivers,
      upcomingBookings: response?.upcomingBookings,
      bookingData: response?.bookingData,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Create City
export const createCity = async (req, res) => {
  console.log("HWLLO:", req.body.cityName);
  try {
    // Fetch statistics
    const response = await adminService.createCity(req.body.cityName);
    console.log("HWLLO 2");

    // Return a response
    return res.status(response?.status).json({
      status: response?.status,
      message: response?.message,
      city: response?.city,
      cities: response?.cities,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get Ctities
export const getCities = async (req, res) => {
  try {
    // Fetch cities
    const response = await adminService.getCities();

    console.log("HELLO:::", JSON.stringify(response?.cities));

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      cities: response?.cities,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ message: internalServerError, error: error });
  }
};

// Get City
export const getCity = async (req, res) => {
  try {
    // Fetch city
    const response = await adminService.getCity(
      req.params.cityId,
      req.query.userCountry
    );

    console.log("HELLO:::", response);

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      city: response?.city,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ message: internalServerError, error: error });
  }
};

// Add airport to city
export const addAirportToCity = async (req, res) => {
  try {
    // add airport to city
    const response = await adminService.addAirportToCity(
      req.body?.cityId,
      req.body?.airport
    );

    console.log("HELLO:::", response);

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      cities: response?.cities,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ message: internalServerError, error: error });
  }
};

// Update city
export const updateCity = async (req, res) => {
  try {
    // update city
    const response = await adminService.updateCityById(
      req.params?.cityId,
      req.body?.city
    );

    // Return a response
    return res.status(response?.status).json({
      status: response?.status,
      message: response?.message,
      cities: response?.cities,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ message: internalServerError, error: error });
  }
};

// Delete city
export const deleteCity = async (req, res) => {
  try {
    // delete city
    const response = await adminService.deleteCityById(req.params?.cityId);

    // Return a response
    return res.status(response?.status).json({
      status: response?.status,
      message: response?.message,
      cities: response?.cities,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ message: internalServerError, error: error });
  }
};

// USERS
// Get users
export const getUsers = async (req, res) => {
  try {
    // Fetch users
    const response = await adminService.getUsers();

    // Return a response
    return res.status(response?.status).json({
      users: response?.users ?? null,
      message: response?.message,
      data: response?.data,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get user by id
export const getUserById = async (req, res) => {
  try {
    // Fetch user
    const response = await adminService.getUserById(req.params.userId);

    // Return a response
    return res
      .status(response?.status)
      .json({ user: response?.user ?? null, message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Delete user by id
export const deleteUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    // DELETE user
    const response = await adminService.deleteUserById(userId);

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      users: response?.users,
      data: response?.data,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// DRIVERS
// Get drivers
export const getDrivers = async (req, res) => {
  try {
    // Fetch drivers
    const response = await adminService.getDrivers();

    // Return a response
    return res.status(response?.status).json({
      drivers: response?.drivers ?? null,
      message: response?.message,
      data: response?.data,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ message: internalServerError });
  }
};
// Get approved drivers
export const getApprovedDrivers = async (req, res) => {
  try {
    // Fetch drivers
    const response = await adminService.getApprovedDrivers();

    // Return a response
    return res.status(response?.status).json({
      drivers: response?.drivers ?? null,
      message: response?.message,
      data: response?.data,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ message: internalServerError });
  }
};

// Get driver by id
export const getDriverById = async (req, res) => {
  try {
    // Fetch driver
    const response = await adminService.getDriverById(req.params.driverId);

    // Return a response
    return res
      .status(response?.status)
      .json({ driver: response?.driver ?? null, message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Approve a driver's account
export const approveDriverAccount = async (req, res) => {
  try {
    // Approve driver account
    const response = await adminService.approveDriverAccount(
      req.params.driverId
    );

    // Return a response
    return res.status(response?.status).json({
      status: response?.status,
      message: response?.message,
      drivers: response?.drivers,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ message: internalServerError });
  }
};

// Assign driver to a job
export const assignDriverToJob = async (req, res) => {
  try {
    // Assign driver to a job
    const response = await adminService.assignDriverToJob(
      req.params.userType,
      req.params.userId,
      req.params.bookingId,
      req.body.bookingRate
    );

    // Return a response
    return res.status(response?.status).json({
      status: response?.status,
      message: response?.message,
      unassignedBookings: response?.updatedUnassignedBookings,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ message: internalServerError });
  }
};

// Fetch upcoming bookings / jobs
export const fetchUpcomingBookings = async (req, res) => {
  try {
    // Fetch upcoming bookings
    const response = await adminService.getUpcomingBookings();

    // Return a response
    return res.status(response?.status).json({
      upcomingBookings: response?.bookings ?? null,
      status: response?.status,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Fetch bookings / jobs awaiting assignment to a driver / vendor
export const fetchBookingsAwaitingAssignment = async (req, res) => {
  try {
    // Fetch bookings awaiting assignment
    const response = await adminService.getBookingsAwaitingAssignment();

    // Return a response
    return res.status(response?.status).json({
      bookings: response?.bookings ?? null,
      status: response?.status,
      message: response?.message,
    });
  } catch (error) {
    console.log("ERROR FROM CONTROLLER:", error);
    return res.status(500).json({ message: internalServerError });
  }
};

// Delete driver by id
export const deleteDriverById = async (req, res) => {
  const { driverId } = req.params;
  try {
    // DELETE driver
    const response = await adminService.deleteDriverById(driverId);

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      drivers: response?.drivers,
      data: response?.data,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// VENDORS
// Get vendors
export const getVendors = async (req, res) => {
  try {
    // Fetch vendors
    const response = await adminService.getVendors();

    // Return a response
    return res.status(response?.status).json({
      vendors: response?.vendors ?? null,
      message: response?.message,
      data: response?.data,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get approved vendors
export const getApprovedVendors = async (req, res) => {
  try {
    // Fetch approved vendors
    const response = await adminService.getApprovedVendors();

    // Return a response
    return res.status(response?.status).json({
      vendors: response?.vendors ?? null,
      message: response?.message,
      data: response?.data,
    });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ message: internalServerError });
  }
};

// Get vendor by id
export const getVendorById = async (req, res) => {
  try {
    // Fetch vendor
    const response = await adminService.getVendorById(req.params.vendorId);

    // Return a response
    return res
      .status(response?.status)
      .json({ vendor: response?.vendor ?? null, message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Approve a vendor's account
export const approveVendorAccount = async (req, res) => {
  try {
    // Approve vendor account
    const response = await adminService.approveVendorAccount(
      req.params.vendorId
    );

    // Return a response
    return res.status(response?.status).json({
      status: response?.status,
      vendors: response?.vendors ?? null,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Delete vendor by id
export const deleteVendorById = async (req, res) => {
  const { vendorId } = req.params;
  try {
    // DELETE vendor
    const response = await adminService.deleteVendorById(vendorId);

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      vendors: response?.vendors,
      data: response?.data,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// ENQUIRIES
// Get enquiries
export const getEnquiries = async (req, res) => {
  try {
    // Fetch enquiries
    const response = await adminService.getEnquiries();

    // Return a response
    return res.status(response?.status).json({
      enquiries: response?.enquiries ?? null,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get enquiry by id
export const getEnquiryById = async (req, res) => {
  try {
    // Fetch enquiry
    const response = await adminService.getEnquiryById(req.params.enquiryId);

    // Return a response
    return res
      .status(response?.status)
      .json({ enquiry: response?.enquiry ?? null, message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Mark enquiry as read
export const markEnquiryAsRead = async (req, res) => {
  try {
    // Mark enquiry as read
    const response = await adminService.markEnquiryAsRead(req.params.enquiryId);

    // Return a response
    return res.status(response?.status).json({
      enquiry: response?.enquiry ?? null,
      message: response?.message,
      enquiries: response?.enquiries,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Mark enquiry as unread
export const markEnquiryAsUnread = async (req, res) => {
  try {
    // Mark enquiry as unread
    const response = await adminService.markEnquiryAsUnread(
      req.params.enquiryId
    );

    // Return a response
    return res.status(response?.status).json({
      enquiry: response?.enquiry ?? null,
      message: response?.message,
      enquiries: response?.enquiries,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Delete enquiry by id
export const deleteEnquiryById = async (req, res) => {
  const { enquiryId } = req.params;
  try {
    // DELETE enquiry
    const response = await adminService.deleteEnquiryById(enquiryId);

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      enquiries: response?.enquiries,
      data: response?.data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: internalServerError, error });
  }
};

// BULK EMAIL
export const sendBulkEmail = async (req, res) => {
  try {
    // Send bulk email
    const response = await adminService.handleSendBulkEmail(
      req.body?.targetAudience,
      req.body?.subject,
      req.body?.email
    );

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError, error });
  }
};

// CURRENCIES / RATES
// Get currencies
export const fetchCurrencies = async (req, res) => {
  try {
    // Fetch currencies
    const response = await adminService.getCurrencies();

    // Return a response
    return res.status(response?.status).json({
      currencies: response?.currencies ?? null,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};
// Create Currency
export const createCurrency = async (req, res) => {
  try {
    // CREATE currency
    const response = await adminService.createNewCurrency(
      req.body?.currencyLabel,
      req.body?.exchangeRate,
      req.body?.currencySymbol,
      req.body?.currencyAlias,
      req.body?.supportedCountries
    );

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      currencies: response?.currencies,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: internalServerError, error });
  }
};

// Update currency
export const updateCurrency = async (req, res) => {
  try {
    // UPDATE currency
    const response = await adminService.updateCurrency(
      req.params?._id,
      req.body?.currencyLabel,
      req.body?.exchangeRate,
      req.body?.symbol,
      req.body?.alias,
      req.body?.supportedCountries
    );

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      currencies: response?.currencies,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: internalServerError, error });
  }
};

// Delete currency
export const deleteCurrency = async (req, res) => {
  try {
    // DELETE currency
    const response = await adminService.deleteCurrency(req.params?._id);

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      currencies: response?.currencies,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: internalServerError, error });
  }
};

// RATE PER MILE
// Set rate per mile
export const setRatePerMile = async (req, res) => {
  try {
    // SET rate per mile
    const response = await adminService.setRatePerMile(
      req.body?.rate,
      req.body?.mile
    );

    // Return a response
    return res.status(response?.status).json({
      status: response?.status,
      message: response?.message,
      ratePerMile: response?.ratePerMile,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: internalServerError, error });
  }
};

// VISA ON ARRIVAL RATES
// Get Visa on arrival rates
export const fetchVisaOnArrivalRates = async (req, res) => {
  try {
    // Fetch visa on arrival rates
    const response = await adminService.getVisaOnArrivalRates();

    // Return a response
    return res.status(response?.status).json({
      visaOnArrivalRates: response?.visaOnArrivalRates ?? null,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Create new visa on arrival rate
export const createVisaOnArrivalRate = async (req, res) => {
  try {
    // CREATE new visa on arrival rate
    const response = await adminService.createNewVisaOnArrivalRate(
      req.body?.country,
      req.body?.visaFee,
      req.body?.isNigerianVisaRequired
    );

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      visaOnArrivalRates: response?.visaOnArrivalRates,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: internalServerError, error });
  }
};

// Update new visa on arrival rate
export const updateVisaOnArrivalRate = async (req, res) => {
  try {
    // UPDATE visa on arrival rate
    const response = await adminService.updateVisaOnArrivalRate(
      req.params?._id,
      req.body?.country,
      req.body?.visaFee,
      req.body?.isNigerianVisaRequired,
      req.body?.voaBaseFeeId
    );

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      visaOnArrivalRates: response?.visaOnArrivalRates,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: internalServerError, error });
  }
};

// Delete new visa on arrival rate
export const deleteVisaOnArrivalRate = async (req, res) => {
  try {
    // DELETE visa on arrival rate
    const response = await adminService.deleteVisaOnArrivalRate(
      req.params?._id
    );

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      visaOnArrivalRates: response?.visaOnArrivalRates,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: internalServerError, error });
  }
};

// VOA BASE RATES
// Get Visa on arrival BASE rates
export const fetchVisaOnArrivalBaseFees = async (req, res) => {
  try {
    // Fetch visa on arrival base rates
    const response = await adminService.getVisaOnArrivalBaseRates();

    // Return a response
    return res.status(response?.status).json({
      voaBaseFees: response?.voaBaseFees ?? null,
      message: response?.message,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Sets visa on arrival base rates
export const setVisaOnArrivalBaseRates = async (req, res) => {
  try {
    // Set visa on arrival base rates
    const response = await adminService.setVisaOnArrivalBaseRates(
      req.body?.transactionFee,
      req.body?.processingFee,
      req.body?.biometricFee,
      req.body?._id
    );

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      voaBaseFees: response?.voaBaseRates,
      visaOnArrivalRates: response?.visaOnArrivalRates,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: internalServerError, error });
  }
};

// VEHICLE CLASSES
// Create vehicle class
export const createVehicleClass = async (req, res) => {
  console.log("VALUES::", req.body);
  try {
    // CREATE new vehicle class
    const response = await vehicleClassService.createVehicleClass(
      req.body?.image,
      req.body?.className,
      req.body?.description,
      req.body?.passengers,
      req.body?.luggages,
      req.body?.basePrice,
      req.body?.cityId
    );

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      vehicleClasses: response?.vehicleClasses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: internalServerError, error });
  }
};
// Update vehicle class
export const updateVehicleClass = async (req, res) => {
  console.log("VALUES::", req.body);
  try {
    // UPDATE vehicle class
    const response = await vehicleClassService.updateVehicleClass(
      req.params?._id,
      {
        ...req.body,
      }
    );

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      vehicleClasses: response?.vehicleClasses,
      cities: response?.cities,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: internalServerError, error });
  }
};
// Delete vehicle class
export const deleteVehicleClass = async (req, res) => {
  console.log("VALUES::", req.body);
  try {
    // DELETE vehicle class
    const response = await vehicleClassService.deleteVehicleClassFromCity(
      req.params?.cityId,
      req.params?._id
    );

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      vehicleClasses: response?.vehicleClasses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: internalServerError, error });
  }
};

// CAR
// Create car
export const createCar = async (req, res) => {
  console.log("VALUES::", req.body);
  try {
    // CREATE new vehicle class
    const response = await carService.createCar(
      req.body?.name,
      req.body?.price
    );

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      cars: response?.cars,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: internalServerError, error });
  }
};
// Update car
export const updateCar = async (req, res) => {
  console.log("VALUES::", req.body);
  try {
    // UPDATE vehicle class
    const response = await carService.updateCar(req.params?._id, {
      ...req.body,
    });

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      cars: response?.cars,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: internalServerError, error });
  }
};
// Delete car
export const deleteCar = async (req, res) => {
  console.log("VALUES::", req.body);
  try {
    // DELETE vehicle class
    const response = await carService.deleteCar(req.params?._id);

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      cars: response?.cars,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: internalServerError, error });
  }
};

// PASSES
// Create pass
export const createPass = async (req, res) => {
  console.log("VALUES::", req.body);
  try {
    // CREATE new priority pass
    const response = await priorityPassService.createPass(
      req.body?.name,
      req.body?.price
    );

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      passes: response?.passes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: internalServerError, error });
  }
};
// Update pass
export const updatePass = async (req, res) => {
  console.log("VALUES::", req.body);
  try {
    // UPDATE pass
    const response = await priorityPassService.updatePass(req.params?._id, {
      ...req.body,
    });

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      passes: response?.passes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: internalServerError, error });
  }
};
// Delete pass
export const deletePass = async (req, res) => {
  console.log("VALUES::", req.body);
  try {
    // DELETE pass
    const response = await priorityPassService.deletePass(req.params?._id);

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      passes: response?.passes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: internalServerError, error });
  }
};

// BLOG
// Create blog post
export const createBlogPost = async (req, res) => {
  console.log("VALUES::", req.body);
  try {
    // CREATE a new blog post
    const response = await blogService.createBlogPost(
      req.body?.image,
      req.body?.title,
      req.body?.content,
      req.body?.author
    );

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      blogPosts: response?.blogPosts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: internalServerError, error });
  }
};
// Update blog post
export const updateBlogPost = async (req, res) => {
  console.log("VALUES::", req.body);
  try {
    // UPDATE blog post
    const response = await blogService.updateBlogPost(req.params?._id, {
      ...req.body,
    });

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      blogPosts: response?.blogPosts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: internalServerError, error });
  }
};
// Delete blog post
export const deleteBlogPost = async (req, res) => {
  console.log("VALUES::", req.body);
  try {
    // DELETE blog post
    const response = await blogService.deleteBlogPost(req.params?._id);

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      status: response?.status,
      blogPosts: response?.blogPosts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: internalServerError, error });
  }
};

// ADMINS
// Delete admin by id
export const deleteAdminById = async (req, res) => {
  const { adminId } = req.params;
  try {
    // DELETE admin
    const response = await adminService.deleteAdminAccountById(adminId);

    // Return a response
    return res.status(response?.status).json({
      status: response?.status,
      message: response?.message,
      adminAccounts: response?.adminAccounts,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Update admin by id
export const updateUserById = async (req, res) => {
  const { adminId } = req.params;

  try {
    // UPDATE admin
    const response = await adminService.updateUserById(adminId, ...req.body);

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get admin total spend by admin id
export const getUserTotalSpendByUserId = async (req, res) => {
  const { adminId } = req.params;

  try {
    // Fetch admin
    const response = await adminService.getUserTotalSpendByUserId(adminId);

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// Get admin bookings by admin id
export const getUserBookingsByUserId = async (req, res) => {
  const { adminId } = req.params;

  try {
    // Fetch admin
    const response = await adminService.getUserBookingsByUserId(adminId);

    // Return a response
    return res.status(response?.status).json({ message: response?.message });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};

// PAYMENTS
// Get Payments
export const getPayments = async (req, res) => {
  try {
    // Fetch payments
    const response = await paymentService.getPayments();

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      payments: response?.payments,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError, error: error });
  }
};

// Get Payment
export const getPayment = async (req, res) => {
  try {
    // Fetch payment
    const response = await paymentService.getPayment(req.params.paymentId);

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      payment: response?.payment,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError, error: error });
  }
};

// BOOKINGS
// GET ALL BOOKINGS
export const getAllBookings = async (req, res) => {
  try {
    // Fetch all bookings
    const response = await bookingService.getBookings();

    // Return a response
    return res.status(response?.status).json({
      message: response?.message,
      airportTransferBookings: response?.airportTransferBookings,
      carRentalBookings: response?.carRentalBookings,
      priorityPassBookings: response?.priorityPassBookings,
      visaOnArrivalBookings: response?.visaOnArrivalBookings,
    });
  } catch (error) {
    return res.status(500).json({ message: internalServerError });
  }
};
