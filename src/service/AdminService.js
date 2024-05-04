import bcrypt from "bcryptjs";
import {
  validateFields,
  validateAdminLoginDetails,
} from "../util/auth.helper.js";
import {
  checkAdminEmailValidity,
  checkAdminUsernameValidity,
} from "../util/db.helper.js";
import PaymentModel from "../model/payment.model.js";
import BookingModel from "../model/booking.model.js";
import AirportTransferBookingModel from "../model/airportTransferBooking.model.js";
import CarRentalBookingModel from "../model/carRentalBooking.model.js";
import PriorityPassBookingModel from "../model/priorityPassBooking.model.js";
import VisaOnArrivalBookingModel from "../model/visaOnArrivalBooking.model.js";
import UserModel from "../model/user.model.js";
import DriverModel from "../model/driver.model.js";
import CityModel from "../model/city.model.js";
import VendorModel from "../model/vendor.model.js";
import EnquiryModel from "../model/enquiry.model.js";
import { sendBulkEmail, sendEmail } from "../util/sendgrid.js";
import CurrencyModel from "../model/currency.model.js";
import RatePerMileModel from "../model/ratePerMile.model.js";
import VisaOnArrivalRateModel from "../model/visaOnArrivalRate.model.js";
import VoaBaseFeesModel from "../model/voaBaseFees.model.js";
import ReactDOMServer from "react-dom/server";

// Email templates
import AssignToBookingEmailTemplate from "../emailTemplates/driverEmailTemplates/AssignToBookingEmail/index.js";
import DriverAccountApprovalEmail from "../emailTemplates/driverEmailTemplates/DriverAccountApprovalEmail/index.js";
import AdminAccountCreationEmailTemplate from "../emailTemplates/adminEmailTemplates/AdminAccountCreationEmail/index.js";
import AdminAccountCreationSuccessfulEmailTemplate from "../emailTemplates/adminEmailTemplates/AdminAccountCreationSuccessfulEmail/index.js";
import { convertAmountToUserCurrency } from "../util/index.js";
import VendorAccountApprovalEmail from "../emailTemplates/vendorEmailTemplates/VendorAccountApprovalEmail/index.js";

export default class AdminService {
  constructor(ShuttlelaneAdminModel) {
    this.AdminModel = ShuttlelaneAdminModel;
  }

  // This service CREATES a new admin - Sign up service
  async signupAdmin(admin) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([
      admin.firstName,
      admin.lastName,
      admin.email,
      admin.username,
      admin.role,
      admin.accessRights,
    ]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if admin is already signed up with the email provided
    const adminAlreadyExistsWithEmail = await checkAdminEmailValidity(
      admin.email
    );

    // Check if admin is already signed up with username
    const adminAlreadyExistsWithUsername = await checkAdminUsernameValidity(
      admin.username
    );

    // If admin email already exists
    if (adminAlreadyExistsWithEmail.status === 409)
      return adminAlreadyExistsWithEmail;

    // If admin email already exists
    if (adminAlreadyExistsWithUsername.status === 409)
      return adminAlreadyExistsWithUsername;

    // Hash password
    // const salt = bcrypt.genSaltSync(10);
    // const hashedPassword = await bcrypt.hash(admin.password, salt);

    // If the email is available, then proceed to sign up the admin
    const newAdmin = await this.AdminModel.create({
      ...admin,
      //   password: hashedPassword,
    });

    // TO-DO: Send confirmation email here
    const fullName = `${newAdmin?.firstName} ${newAdmin?.lastName}`;
    const emailHTML = AdminAccountCreationEmailTemplate({
      fullName,
      email: newAdmin?.email,
      username: newAdmin?.username,
      role: newAdmin?.role,
      _id: newAdmin?._id,
    });

    const message = {
      to: newAdmin?.email,
      from: process.env.SENGRID_EMAIL,
      subject: "⚠ Action Required",
      html: ReactDOMServer.renderToString(emailHTML),
    };

    sendEmail(message);

    // Get admin accounts
    const adminAccounts = await this.AdminModel.find({});

    console.log("ADMIN:", newAdmin);
    return {
      status: 201,
      message: "Admin account has been created successfully!",
      admin: newAdmin,
      adminAccounts: adminAccounts,
    };
  }

  // This service CREATES a new admin - Sign up service
  async completeAdminAccountSignup(admin) {
    console.log("HELLO FROM COMPLETE SIGNU ADMIN");
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([
      admin.image,
      admin.password,
      admin._id,
    ]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(admin.password, salt);

    // If the email is available, then proceed to sign up the admin
    const newAdmin = await this.AdminModel.findOneAndUpdate(
      {
        _id: admin?._id,
      },
      {
        image: admin?.image,
        password: hashedPassword,
      }
    );

    // TO-DO: Send confirmation email here
    const fullName = `${newAdmin?.firstName} ${newAdmin?.lastName}`;
    const emailHTML = AdminAccountCreationSuccessfulEmailTemplate({
      role: newAdmin?.role,
    });

    const message = {
      to: newAdmin?.email,
      from: process.env.SENGRID_EMAIL,
      subject: "Admin Account Setup Completed!🎊",
      html: ReactDOMServer.renderToString(emailHTML),
    };

    sendEmail(message);

    return {
      status: 201,
      message: "Admin account setup completed!",
      admin: newAdmin,
    };
  }

  // This service DELETES an admin by id
  async deleteAdminAccountById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any admin exists with the _id
    const admin = await this.AdminModel.findOneAndRemove({ _id: _id });

    if (!admin) {
      return {
        status: 404,
        message: `No admin with _id ${_id} exists.`,
      };
    }

    const admins = await this.AdminModel.find({}).sort({ createdAt: -1 });

    return {
      status: 201,
      message: `Admin deleted successfully.`,
      adminAccounts: admins,
    };
  }

  // This service GETS all admin accounts
  async fetchAdminAccounts() {
    // Get admin accounts
    const adminAccounts = await this.AdminModel.find({});

    return {
      status: 200,
      message: `Fetched admin accounts.`,
      adminAccounts: adminAccounts,
    };
  }

  // This service logs in the admin
  async loginAdmin(username, password) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([username, password]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // If the fields are not empty, check the DB for username
    const adminExists = await validateAdminLoginDetails(username, password);

    // TODO: If admin has 2FA turned on, Send OTP to admin's username
    // return {
    //     status: 200,
    //     message: 'An OTP was sent to your registered username.'
    // }

    return adminExists;
  }

  // This service GETS a admin by their email
  async getAdminByEmail(email) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([email]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any admin exists with the email
    const admin = await this.AdminModel.findOne({
      email: email,
    });

    if (!admin) {
      return {
        status: 404,
        message: "No admin exists with the email specified.",
        admin: admin,
      };
    }

    return {
      status: 200,
      message: `Fetched admin with email ${email}.`,
      admin: admin,
    };
  }

  // This service GETS dashboard statistics
  async getStatistics() {
    // Fetch the number of airport transfer bookings
    const numberOfAirportTransferBookings =
      await AirportTransferBookingModel.find().count();
    // Fetch the number of car rental bookings
    const numberOfCarRentalBookings =
      await CarRentalBookingModel.find().count();
    // Fetch the number of priority pass bookings
    const numberOfPriorityPassBookings =
      await PriorityPassBookingModel.find().count();
    // Fetch the number of visa on arrival bookings
    const numberOfVisaOnArrivalBookings =
      await VisaOnArrivalBookingModel.find().count();
    // Fetch users
    const users = await UserModel.find();
    // Fetch drivers
    const drivers = await DriverModel.find();
    // Fetch upcomingBookings
    const today = new Date(); // Get today's date
    const upcomingBookings = await BookingModel.find({
      pickupDate: { $gt: today },
    })
      .populate("paymentId")
      .populate("user")
      .populate("booking");

    // Fetch the total revenue
    const totalPayments = await PaymentModel.find({});

    // Fetch all bookings from all months
    const data = await BookingModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
          users: { $push: "$$ROOT" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    return {
      status: 200,
      message: `Fetched statistics`,
      numberOfAirportTransferBookings: numberOfAirportTransferBookings,
      numberOfCarRentalBookings: numberOfCarRentalBookings,
      numberOfPriorityPassBookings: numberOfPriorityPassBookings,
      numberOfVisaOnArrivalBookings: numberOfVisaOnArrivalBookings,
      drivers: drivers,
      users: users,
      upcomingBookings: upcomingBookings,
      bookingData: data,
    };
  }

  // This service CREATES a new city
  async createCity(cityName) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([cityName]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    const city = await CityModel.findOne({
      cityName,
    });

    console.log("CITY:::", city);

    if (city) {
      return {
        status: 409,
        message:
          "This city already exists. Try adding a city with a different name.",
      };
    }

    const newCity = await CityModel.create({
      cityName: cityName,
    });

    // Fetch all cities (So the frontend can be update without having to refresh the page & to prevent making another request to get cities)
    const cities = await CityModel.find().sort({ createdAt: -1 });

    return {
      status: 201,
      message: `City created successfully!`,
      city: newCity,
      cities: cities,
    };
  }

  // This service fetches all cities
  async getCities() {
    console.log("HELLO1");
    const cities = await CityModel.find({})
      .populate("vehicleClasses")
      .populate("cars");

    console.log("HELLO2:::", cities);
    // Return a response
    return {
      status: 200,
      message: `Cities fetched`,
      cities: cities,
    };
  }

  // This service fetches a city
  async getCity(cityId, userCountry, isAdminRequest) {
    console.log("HELLO1");
    const city = await CityModel.findOne({ _id: cityId })
      .populate("vehicleClasses")
      .populate("cars");

    if (isAdminRequest) {
      // Return a response
      return {
        status: 200,
        message: `City fetched`,
        city: city,
      };
    }

    // Get currency (UPDATE LATER TO INCLUDE MORE THAN ONE COUNTRY) where the userCountry is listed
    const allowedCurrency = await CurrencyModel.findOne({
      supportedCountries: { $in: [userCountry] },
    })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log("ERROR:", err);
      });

    console.log("ALLOWED CURRENCY:", allowedCurrency);

    // Check if the user's country has been added to a currency
    if (allowedCurrency) {
      let vehicleClassesWithConvertedRates = [];
      for (let i = 0; i < city?.vehicleClasses?.length; i++) {
        let convertedRate = await convertAmountToUserCurrency(
          allowedCurrency,
          city?.vehicleClasses[i]?.basePrice
        );
        city.vehicleClasses[i].basePrice = convertedRate;
        vehicleClassesWithConvertedRates.push(city?.vehicleClasses[i]);
      }
      let carsWithConvertedRates = [];
      for (let i = 0; i < city?.cars?.length; i++) {
        let convertedRate = await convertAmountToUserCurrency(
          allowedCurrency,
          city?.cars[i]?.price
        );
        city.cars[i].price = convertedRate;
        carsWithConvertedRates.push(city?.cars[i]);
      }

      let cityWithConvertedRate = {
        _id: city?._id,
        cityName: city?.cityName,
        airports: city?.airports,
        vehicleClasses: vehicleClassesWithConvertedRates,
        cars: carsWithConvertedRates,
      };

      console.log("CITY:", cityWithConvertedRate);

      // Return a response
      return {
        status: 200,
        message: `Cities fetched`,
        city: cityWithConvertedRate,
        currency: allowedCurrency,
      };
    } else {
      // Default to Dollars
      const userCurrency = await CurrencyModel.findOne({ symbol: "$" });

      let vehicleClassesWithConvertedRates = [];
      for (let i = 0; i < city?.vehicleClasses?.length; i++) {
        let convertedRate = await convertAmountToUserCurrency(
          userCurrency,
          city?.vehicleClasses[i]?.basePrice
        );
        city.vehicleClasses[i].basePrice = convertedRate;
        vehicleClassesWithConvertedRates.push(city?.vehicleClasses[i]);
      }
      let carsWithConvertedRates = [];
      for (let i = 0; i < city?.cars?.length; i++) {
        let convertedRate = await convertAmountToUserCurrency(
          userCurrency,
          city?.cars[i]?.basePrice
        );
        city.cars[i].basePrice = convertedRate;
        carsWithConvertedRates.push(city?.cars[i]);
      }

      let cityWithConvertedRate = {
        _id: city?._id,
        cityName: city?.cityName,
        airports: city?.airports,
        vehicleClasses: vehicleClassesWithConvertedRates,
        cars: carsWithConvertedRates,
      };

      console.log("CITY:", cityWithConvertedRate);

      // Return a response
      return {
        status: 200,
        message: `City fetched`,
        city: cityWithConvertedRate,
        currency: userCurrency,
      };
    }
  }

  // This service adds an airport to a city
  async addAirportToCity(cityId, airport) {
    console.log("CITY ID:", cityId);
    const city = await CityModel.findOne({ _id: cityId });

    console.log("CITY::", city);
    city.airports?.push(airport);
    await city.save();

    const cities = await CityModel.find({});

    // Return a response
    return {
      status: 201,
      message: `New airport added to ${city?.cityName} successfully!`,
      cities: cities,
    };
  }

  // This service UPDATES a city by id
  async updateCityById(_id, updatedCity) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, updatedCity]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any city exists with the _id
    const city = await CityModel.findOneAndUpdate(
      { _id: _id },
      { ...updatedCity }
    );

    if (!city) {
      return {
        status: 404,
        message: `No city with _id ${_id} exists.`,
      };
    }

    const cities = await CityModel.find({});

    return {
      status: 201,
      message: `City updated successfully.`,
      cities: cities,
    };
  }

  // This service DELETES a city by id
  async deleteCityById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any city exists with the _id
    const city = await CityModel.findOneAndRemove({ _id: _id });

    if (!city) {
      return {
        status: 404,
        message: `No city with _id ${_id} exists.`,
      };
    }

    const cities = await CityModel.find({});

    return {
      status: 201,
      message: `City deleted successfully.`,
      cities: cities,
    };
  }

  // This service GETS all users
  async getUsers() {
    // Get users
    const users = await UserModel.find({}).populate({
      path: "bookings",
    });

    const data = await UserModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
          users: { $push: "$$ROOT" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    console.log("users:", users);
    console.log("data:", data);

    return {
      status: 200,
      message: `Fetched users.`,
      users: users,
      data: data,
    };
  }

  // This service GETS a user by their id
  async getUserById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any user exists with the user id
    const user = await UserModel.findOne({
      _id: _id,
    }).populate({
      path: "bookings",
    });

    if (!user) {
      return {
        status: 404,
        message: "No user exists with the id specified.",
        user: user,
      };
    }

    return {
      status: 200,
      message: `Fetched user with id ${_id}.`,
      user: user,
    };
  }

  // This service DELETES a user by id
  async deleteUserById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any user exists with the _id
    const user = await UserModel.findOneAndRemove({ _id: _id });

    if (!user) {
      return {
        status: 404,
        message: `No user with _id ${_id} exists.`,
      };
    }

    const users = await UserModel.find({}).sort({ createdAt: -1 });
    const data = await UserModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
          users: { $push: "$$ROOT" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    return {
      status: 201,
      message: `User deleted successfully.`,
      users: users,
      data: data,
    };
  }

  // This service GETS all drivers
  async getDrivers() {
    // Get drivers
    const drivers = await DriverModel.find({}).populate({
      path: "bookingsAssignedTo",
    });

    const data = await DriverModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
          drivers: { $push: "$$ROOT" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    console.log("drivers:", drivers);
    console.log("data:", data);

    return {
      status: 200,
      message: `Fetched drivers.`,
      drivers: drivers,
      data: data,
    };
  }

  // This service GETS all drivers
  async getApprovedDrivers() {
    // Get drivers
    const drivers = await DriverModel.find({
      isAccountApproved: true,
    });

    const data = await DriverModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
          drivers: { $push: "$$ROOT" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    console.log("drivers:", drivers);
    console.log("data:", data);

    return {
      status: 200,
      message: `Fetched drivers.`,
      drivers: drivers,
      data: data,
    };
  }

  // This service GETS a driver by their id
  async getDriverById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any driver exists with the driver id
    const driver = await DriverModel.findOne({
      _id: _id,
    }).populate({
      path: "bookings",
    });

    if (!driver) {
      return {
        status: 404,
        message: "No driver exists with the id specified.",
        driver: driver,
      };
    }

    return {
      status: 200,
      message: `Fetched driver with id ${_id}.`,
      driver: driver,
    };
  }

  // This service APPROVES a driver account by their id
  async approveDriverAccount(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any driver exists with the driver id
    const driver = await DriverModel.findOneAndUpdate(
      {
        _id: _id,
      },
      { isAccountApproved: true }
    );

    if (!driver) {
      return {
        status: 404,
        message: "No driver exists with the id specified.",
        driver: driver,
      };
    }

    // TO-DO: Send driver a confirmation email here
    const emailHTML = DriverAccountApprovalEmail({
      driver,
    });

    const message = {
      to: driver.email,
      from: process.env.SENGRID_EMAIL,
      subject: "Driver Account Has Been Approved🎉",
      html: ReactDOMServer.renderToString(emailHTML),
    };
    await sendEmail(message);

    const drivers = await DriverModel.find({});

    return {
      status: 201,
      message: `Driver account has been approved`,
      drivers: drivers,
    };
  }

  // This service ASSIGNS a driver to a job
  async assignDriverToJob(userType, userId, bookingId, bookingRate) {
    console.log("VALUES:", userType, userId, bookingId, bookingRate);

    // Validate if fields are empty
    const areFieldsEmpty = validateFields([
      userType,
      userId,
      bookingId,
      bookingRate,
    ]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    let vendor, driver;

    if (userType == "Driver") {
      // Check if any driver exists with the driver id
      driver = await DriverModel.findOne({
        _id: userId,
        isAccountApproved: true,
      }).populate({
        path: "bookingsAssignedTo",
      });

      if (!driver) {
        return {
          status: 404,
          message: "No driver exists with the id specified.",
          driver: driver,
        };
      }

      driver?.bookingsAssignedTo?.push(bookingId);
      console.log("DBAT:", driver?.bookingsAssignedTo);

      const updateDriver = await DriverModel.findOneAndUpdate(
        { _id: driver?._id },
        {
          bookingsAssignedTo: driver?.bookingsAssignedTo,
        }
      );

      const updateBooking = await BookingModel.findOneAndUpdate(
        {
          _id: bookingId,
        },
        {
          driverJobWasSentTo: driver?._id,
          hasDriverAccepted: false,
          hasDriverDeclined: false,
          bookingStatus: "Awaiting response",
          bookingRate: bookingRate,
        }
      ).populate({
        path: "booking",
      });

      // Sample booking data
      const booking = {
        "Passenger Name": `${updateBooking?.firstName} ${updateBooking?.lastName}`,
        "Pickup Location": `${updateBooking?.booking?.pickupAddress}`,
        Destination: `${updateBooking?.booking?.dropoffAddress}`,
        "Date & Time": `${updateBooking?.booking?.pickupDate?.toLocaleDateString(
          "en-US"
        )} at ${updateBooking?.booking?.pickupTime?.toLocaleTimeString(
          "en-US",
          {
            hour12: true,
          }
        )}`,
        "Booking Rate": `${
          updateBooking?.bookingCurrency?.symbol ?? "₦"
        }${Intl.NumberFormat("en-US", {}).format(bookingRate)}`,
      };

      const emailHTML = AssignToBookingEmailTemplate({
        booking,
        driverId: driver?._id?.toString(),
      });

      //   console.log("EMAIL:", emailHTML);

      const message = {
        to: updateDriver?.email,
        from: process.env.SENGRID_EMAIL,
        subject: "🚨New Job Alert🚨",
        html: ReactDOMServer.renderToString(emailHTML),
      };
      await sendEmail(message);

      const bookingsAwaitingAssignment = await BookingModel.find({
        bookingStatus: "Not yet assigned",
      })
        .populate("booking")
        .populate("paymentId");

      const updatedUnassignedBookings = bookingsAwaitingAssignment?.filter(
        (booking) => {
          return booking?.bookingType !== "Visa";
        }
      );

      return {
        status: 201,
        updatedUnassignedBookings,
        message: `Booking has been successfully assigned to ${driver?.firstName} ${driver?.lastName}.`,
      };
    } else {
      // Check if any vendor exists with the vendor id
      vendor = await VendorModel.findOne({
        _id: userId,
        isAccountApproved: true,
      }).populate({
        path: "bookingsAssignedTo",
      });

      if (!vendor) {
        return {
          status: 404,
          message:
            "No vendor exists with the id specified or this account has ont been approved yet.",
          vendor: vendor,
        };
      }

      const updatedBookingsAssignedToList =
        vendor?.bookingsAssignedTo?.push(bookingId);

      const updateVendor = await VendorModel.findOneAndUpdate(
        { _id: vendor?._id },
        {
          bookingsAssignedTo: updatedBookingsAssignedToList,
        }
      );

      const updateBooking = await BookingModel.findOneAndUpdate(
        {
          _id: bookingId,
        },
        {
          vendorJobWasSentTo: vendor?._id,
          hasVendorAccepted: false,
          hasVendorDeclined: false,
          bookingStatus: "Awaiting response",
          bookingRate: bookingRate,
        }
      ).populate({
        path: "booking",
      });

      // Sample booking data
      const booking = {
        _id: updateBooking?._id,
        "Passenger Name": `${updateBooking?.firstName} ${updateBooking?.lastName}`,
        "Pickup Location": `${updateBooking?.booking?.pickupLocation}`,
        Destination: `${updateBooking?.booking?.dropoffLocation}`,
        "Date & Time": `${updateBooking?.booking?.pickupDate?.toLocaleDateString(
          "en-US"
        )} at ${updateBooking?.booking?.pickupTime?.toLocaleTimeString(
          "en-US",
          {
            hour12: true,
          }
        )}`,
        "Booking Rate": `${
          updateBooking?.bookingCurrency?.symbol ?? "₦"
        }${Intl.NumberFormat("en-US", {}).format(bookingRate)}`,
      };

      const emailHTML = AssignToBookingEmailTemplate({
        booking: booking,
        driverId: updateVendor?._id,
      });

      const message = {
        to: updateVendor?.email,
        from: process.env.SENGRID_EMAIL,
        subject: "🚨New Job Alert🚨",
        html: ReactDOMServer.renderToString(emailHTML),
      };
      sendEmail(message);

      return {
        status: 201,
        message: `Booking has been successfully assigned to ${vendor?.companyName}`,
      };
    }
  }

  // This service GETS all drivers
  async getDrivers() {
    // Get drivers
    const drivers = await DriverModel.find({}).populate({
      path: "bookingsAssignedTo",
    });

    const data = await DriverModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
          drivers: { $push: "$$ROOT" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    console.log("drivers:", drivers);
    console.log("data:", data);

    return {
      status: 200,
      message: `Fetched drivers.`,
      drivers: drivers,
      data: data,
    };
  }

  // This service GETS all drivers
  async getApprovedDrivers() {
    // Get drivers
    const drivers = await DriverModel.find({
      isAccountApproved: true,
    });

    const data = await DriverModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
          drivers: { $push: "$$ROOT" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    console.log("drivers:", drivers);
    console.log("data:", data);

    return {
      status: 200,
      message: `Fetched drivers.`,
      drivers: drivers,
      data: data,
    };
  }

  // This service GETS a driver by their id
  async getDriverById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any driver exists with the driver id
    const driver = await DriverModel.findOne({
      _id: _id,
    }).populate({
      path: "bookings",
    });

    if (!driver) {
      return {
        status: 404,
        message: "No driver exists with the id specified.",
        driver: driver,
      };
    }

    return {
      status: 200,
      message: `Fetched driver with id ${_id}.`,
      driver: driver,
    };
  }

  // This service APPROVES a driver account by their id
  async approveDriverAccount(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any driver exists with the driver id
    const driver = await DriverModel.findOneAndUpdate(
      {
        _id: _id,
      },
      { isAccountApproved: true }
    );

    if (!driver) {
      return {
        status: 404,
        message: "No driver exists with the id specified.",
        driver: driver,
      };
    }

    // TO-DO: Send driver a confirmation email here
    const emailHTML = DriverAccountApprovalEmail({
      driver,
    });

    const message = {
      to: driver.email,
      from: process.env.SENGRID_EMAIL,
      subject: "Driver Account Has Been Approved🎉",
      html: ReactDOMServer.renderToString(emailHTML),
    };
    await sendEmail(message);

    const drivers = await DriverModel.find({});

    return {
      status: 201,
      message: `Driver account has been approved`,
      drivers: drivers,
    };
  }

  // This service ASSIGNS a driver to a job
  async assignDriverToJob(userType, userId, bookingId, bookingRate) {
    console.log("VALUES:", userType, userId, bookingId, bookingRate);

    // Validate if fields are empty
    const areFieldsEmpty = validateFields([
      userType,
      userId,
      bookingId,
      bookingRate,
    ]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    let vendor, driver;

    if (userType == "Driver") {
      // Check if any driver exists with the driver id
      driver = await DriverModel.findOne({
        _id: userId,
        isAccountApproved: true,
      }).populate({
        path: "bookingsAssignedTo",
      });

      if (!driver) {
        return {
          status: 404,
          message: "No driver exists with the id specified.",
          driver: driver,
        };
      }

      driver?.bookingsAssignedTo?.push(bookingId);
      console.log("DBAT:", driver?.bookingsAssignedTo);

      const updateDriver = await DriverModel.findOneAndUpdate(
        { _id: driver?._id },
        {
          bookingsAssignedTo: driver?.bookingsAssignedTo,
        }
      );

      const updateBooking = await BookingModel.findOneAndUpdate(
        {
          _id: bookingId,
        },
        {
          driverJobWasSentTo: driver?._id,
          hasDriverAccepted: false,
          hasDriverDeclined: false,
          bookingStatus: "Awaiting response",
          bookingRate: bookingRate,
        }
      ).populate({
        path: "booking",
      });

      // Sample booking data
      const booking = {
        "Passenger Name": `${updateBooking?.firstName} ${updateBooking?.lastName}`,
        "Pickup Location": `${updateBooking?.booking?.pickupAddress}`,
        Destination: `${updateBooking?.booking?.dropoffAddress}`,
        "Date & Time": `${updateBooking?.booking?.pickupDate?.toLocaleDateString(
          "en-US"
        )} at ${updateBooking?.booking?.pickupTime?.toLocaleTimeString(
          "en-US",
          {
            hour12: true,
          }
        )}`,
        "Booking Rate": `${
          updateBooking?.bookingCurrency?.symbol ?? "₦"
        }${Intl.NumberFormat("en-US", {}).format(bookingRate)}`,
      };

      const emailHTML = AssignToBookingEmailTemplate({
        booking,
        driverId: driver?._id?.toString(),
      });

      //   console.log("EMAIL:", emailHTML);

      const message = {
        to: updateDriver?.email,
        from: process.env.SENGRID_EMAIL,
        subject: "🚨New Job Alert🚨",
        html: ReactDOMServer.renderToString(emailHTML),
      };
      await sendEmail(message);

      const bookingsAwaitingAssignment = await BookingModel.find({
        bookingStatus: "Not yet assigned",
      })
        .populate("booking")
        .populate("paymentId");

      const updatedUnassignedBookings = bookingsAwaitingAssignment?.filter(
        (booking) => {
          return booking?.bookingType !== "Visa";
        }
      );

      return {
        status: 201,
        updatedUnassignedBookings,
        message: `Booking has been successfully assigned to ${driver?.firstName} ${driver?.lastName}.`,
      };
    } else {
      console.log("HELLO 1111");
      // Check if any vendor exists with the vendor id
      vendor = await VendorModel.findOne({
        _id: userId,
        isAccountApproved: true,
      }).populate({
        path: "bookingsAssignedTo",
      });

      console.log("HELLO 2222");

      if (!vendor) {
        return {
          status: 404,
          message:
            "No vendor exists with the id specified or this account has ont been approved yet.",
          vendor: vendor,
        };
      }

      console.log("HELLO 3333");

      vendor?.bookingsAssignedTo?.push(bookingId);
      console.log("DBAT:", vendor?.bookingsAssignedTo);

      const updateVendor = await VendorModel.findOneAndUpdate(
        { _id: vendor?._id },
        {
          bookingsAssignedTo: vendor?.bookingsAssignedTo,
        }
      );

      console.log("HELLO 4444");

      const updateBooking = await BookingModel.findOneAndUpdate(
        {
          _id: bookingId,
        },
        {
          vendorJobWasSentTo: vendor?._id,
          hasVendorAccepted: false,
          hasVendorDeclined: false,
          bookingStatus: "Awaiting response",
          bookingRate: bookingRate,
        }
      ).populate({
        path: "booking",
      });

      console.log("HELLO 5555:", updateBooking);

      // Sample booking data
      const booking = {
        "Passenger Name": `${updateBooking?.firstName} ${updateBooking?.lastName}`,
        "Pickup Location": `${updateBooking?.booking?.pickupAddress}`,
        Destination: `${updateBooking?.booking?.dropoffAddress}`,
        "Date & Time": `${updateBooking?.booking?.pickupDate?.toLocaleDateString(
          "en-US"
        )} at ${updateBooking?.booking?.pickupTime?.toLocaleTimeString(
          "en-US",
          {
            hour12: true,
          }
        )}`,
        "Booking Rate": `${
          updateBooking?.bookingCurrency?.symbol ?? "₦"
        }${Intl.NumberFormat("en-US", {}).format(bookingRate)}`,
      };

      console.log("HELLO 6666:", typeof updateVendor?._id?.toString());

      const emailHTML = AssignToBookingEmailTemplate({
        booking,
        driverId: updateVendor?._id?.toString(),
      });

      const message = {
        to: updateVendor?.companyEmail,
        from: process.env.SENGRID_EMAIL,
        subject: "🚨New Job Alert🚨",
        html: ReactDOMServer.renderToString(emailHTML),
      };
      sendEmail(message);

      const bookingsAwaitingAssignment = await BookingModel.find({
        bookingStatus: "Not yet assigned",
      }).populate("booking");

      const updatedUnassignedBookings = bookingsAwaitingAssignment?.filter(
        (booking) => {
          return booking?.bookingType !== "Visa";
        }
      );

      return {
        status: 201,
        updatedUnassignedBookings,
        message: `Booking has been successfully assigned to ${vendor?.companyName}`,
      };
    }
  }

  // This service GETS upcoming bookings i.e Bookings that have been assigned to a driver but have not been completed
  async getUpcomingBookings() {
    // Fetch upcoming bookings
    const upcomingBookings = await BookingModel.find({
      bookingStatus: "Scheduled",
    })
      .populate("paymentId")
      .populate("user")
      .populate("booking");

    return {
      status: 200,
      message: `Fetched upcoming bookings.`,
      bookings: upcomingBookings,
    };
  }

  // This service GETS bookings that have not been assigned to a driver / vendor
  async getVisaOnArrivalBookings() {
    // Fetch upcoming bookings
    const visaOnArrivalBookings = await BookingModel.find({
      bookingType: "Visa",
    })
      .populate("paymentId")
      .populate("user")
      .populate("booking");

    return {
      status: 200,
      message: `Fetched visa on arrival bookings.`,
      bookings: visaOnArrivalBookings,
    };
  }

  // This service GETS bookings that have not been assigned to a driver / vendor
  async getBookingsAwaitingAssignment() {
    console.log("OVER HERE 1");
    // Fetch upcoming bookings
    const bookingsAwaitingAssignment = await BookingModel.find({
      bookingStatus: "Not yet assigned",
    })
      .populate({
        path: "booking",
      })
      .populate({
        path: "bookingCurrency",
      })
      .populate({
        path: "assignedDriver",
      })
      .populate({
        path: "assignedVendor",
      })
      .populate({
        path: "paymentId",
      })
      .populate({
        path: "assignedDriver",
      })
      .populate({
        path: "user",
      });

    console.log("OVER HERE 2:", bookingsAwaitingAssignment);
    // Remove Visa On Arrival Bookings
    const filteredBookings = bookingsAwaitingAssignment?.filter((booking) => {
      return booking?.bookingType !== "Visa";
    });
    console.log("OVER HERE 3:", filteredBookings);

    return {
      status: 200,
      message: `Fetched all bookings awaiting assignment.`,
      bookings: filteredBookings,
    };
  }

  // This service DELETES a driver by id
  async deleteDriverById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any driver exists with the _id
    const driver = await DriverModel.findOneAndRemove({ _id: _id });

    if (!driver) {
      return {
        status: 404,
        message: `No driver with _id ${_id} exists.`,
      };
    }

    const drivers = await DriverModel.find({}).sort({ createdAt: -1 });
    const data = await DriverModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
          drivers: { $push: "$$ROOT" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    return {
      status: 201,
      message: `Driver deleted successfully.`,
      drivers: drivers,
      data: data,
    };
  }

  // VENDORS
  // This service GETS all vendors
  async getVendors() {
    // Get vendors
    const vendors = await VendorModel.find({})
      .populate({
        path: "bookingsAssignedTo",
      })
      .populate({
        path: "operatingCities",
      });

    const data = await VendorModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
          vendors: { $push: "$$ROOT" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    console.log("vendors:", vendors);
    console.log("data:", data);

    return {
      status: 200,
      message: `Fetched vendors.`,
      vendors: vendors,
      data: data,
    };
  }

  // This service GETS all approved Vendors
  async getApprovedVendors() {
    // Get vendors
    const vendors = await VendorModel.find({
      isAccountApproved: true,
    })
      .populate({
        path: "bookingsAssignedTo",
      })
      .populate({
        path: "operatingCities",
      });

    const data = await VendorModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
          vendors: { $push: "$$ROOT" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    console.log("vendors:", vendors);
    console.log("data:", data);

    return {
      status: 200,
      message: `Fetched approved vendors.`,
      vendors: vendors,
      data: data,
    };
  }

  // This service GETS a vendor by their id
  async getVendorById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any vendor exists with the vendor id
    const vendor = await VendorModel.findOne({
      _id: _id,
    })
      .populate({
        path: "bookingsAssignedTo",
      })
      .populate({
        path: "operatingCities",
      });

    if (!vendor) {
      return {
        status: 404,
        message: "No vendor exists with the id specified.",
        vendor: vendor,
      };
    }

    return {
      status: 200,
      message: `Fetched vendor with id ${_id}.`,
      vendor: vendor,
    };
  }

  // This service APPROVES a vendor account by their id
  async approveVendorAccount(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any vendor exists with the vendor id
    const vendor = await VendorModel.findOneAndUpdate(
      {
        _id: _id,
      },
      { isAccountApproved: true }
    )
      .populate({
        path: "bookingsAssignedTo",
      })
      .populate({
        path: "operatingCities",
      });

    if (!vendor) {
      return {
        status: 404,
        message: "No vendor exists with the id specified.",
        vendor: vendor,
      };
    }

    // TO-DO: Send vendor a confirmation email here
    const emailHTML = VendorAccountApprovalEmail({
      vendor,
    });

    const message = {
      to: vendor.companyEmail,
      from: process.env.SENGRID_EMAIL,
      subject: "Vendor Account Has Been Approved🎉",
      html: ReactDOMServer.renderToString(emailHTML),
    };
    await sendEmail(message);

    const vendors = await VendorModel.find({});

    return {
      status: 201,
      message: `Vendor account has been approved`,
      vendors: vendors,
    };
  }

  // This service DELETES a vendor by id
  async deleteVendorById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any vendor exists with the _id
    const vendor = await VendorModel.findOneAndRemove({ _id: _id });

    if (!vendor) {
      return {
        status: 404,
        message: `No vendor with _id ${_id} exists.`,
      };
    }

    const vendors = await VendorModel.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: "bookingsAssignedTo",
      })
      .populate({
        path: "operatingCities",
      });
    const data = await VendorModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
          vendors: { $push: "$$ROOT" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    return {
      status: 201,
      message: `Vendor deleted successfully.`,
      vendors: vendors,
      data: data,
    };
  }

  // ENQUIRIES
  // This service GETS all enquiries
  async getEnquiries() {
    // Get enquiries
    const enquiries = await EnquiryModel.find({}).sort({ createdAt: -1 });

    return {
      status: 200,
      message: `Fetched enquiries.`,
      enquiries: enquiries,
    };
  }

  // This service GETS a enquiry by their id
  async getEnquiryById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any enquiry exists with the enquiry id
    const enquiry = await EnquiryModel.findOne({
      _id: _id,
    });

    if (!enquiry) {
      return {
        status: 404,
        message: "No enquiry exists with the id specified.",
        enquiry: enquiry,
      };
    }

    return {
      status: 200,
      message: `Fetched enquiry with id ${_id}.`,
      enquiry: enquiry,
    };
  }

  // This service marks an enquiry as read
  async markEnquiryAsRead(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any enquiry exists with the enquiry id
    const enquiry = await EnquiryModel.findOneAndUpdate(
      {
        _id: _id,
      },
      { isRead: true }
    );

    if (!enquiry) {
      return {
        status: 404,
        message: "No enquiry exists with the id specified.",
        enquiry: enquiry,
      };
    }

    const enquiries = await EnquiryModel.find({});

    return {
      status: 201,
      message: `Enquiry marked as read`,
      enquiry: enquiry,
      enquiries: enquiries,
    };
  }

  // This service marks an enquiry as unread
  async markEnquiryAsUnread(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any enquiry exists with the enquiry id
    const enquiry = await EnquiryModel.findOneAndUpdate(
      {
        _id: _id,
      },
      { isRead: false }
    );

    if (!enquiry) {
      return {
        status: 404,
        message: "No enquiry exists with the id specified.",
        enquiry: enquiry,
      };
    }

    const enquiries = await EnquiryModel.find({});

    return {
      status: 201,
      message: `Enquiry marked as read`,
      enquiry: enquiry,
      enquiries: enquiries,
    };
  }

  // This service DELETES a enquiry by id
  async deleteEnquiryById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any enquiry exists with the _id
    const enquiry = await EnquiryModel.findOneAndRemove({ _id: _id });

    if (!enquiry) {
      return {
        status: 404,
        message: `No enquiry with _id ${_id} exists.`,
      };
    }

    const enquiries = await EnquiryModel.find({}).sort({ createdAt: -1 });

    return {
      status: 201,
      message: `Enquiry deleted successfully.`,
      enquiries: enquiries,
    };
  }

  // BULK EMAIL
  // This service sends bulk email to a select target audience
  async handleSendBulkEmail(targetAudience, subject, email) {
    // Get users
    const users = await UserModel.find({});
    const drivers = await DriverModel.find({});
    const vendors = await VendorModel.find({});

    // Prepare email addresses
    let recipients;
    if (targetAudience === "users") {
      recipients = users;
    } else if (targetAudience === "drivers") {
      recipients = drivers;
    } else if (targetAudience === "vendors") {
      recipients = vendors;
    } else {
      recipients = [...users, ...drivers, ...vendors];
    }

    if (!recipients || recipients?.length < 1) {
      return {
        status: 404,
        message: "There are no recipients in the chosen category.",
      };
    }

    const response = await sendBulkEmail(recipients, subject, email);

    return {
      status: response?.status,
      message: response?.message,
    };
  }

  // CURRENCY AND RATES
  // This service GETS all currencies
  async getCurrencies() {
    // Get currencies
    const currencies = await CurrencyModel.find({}).sort({ createdAt: -1 });

    return {
      status: 200,
      message: `Fetched currencies.`,
      currencies: currencies,
    };
  }
  // This service creates a new currency
  async createNewCurrency(
    currencyLabel,
    exchangeRatePercentage,
    additionalRate,
    currencySymbol,
    currenncyAlias,
    supportedCountries
  ) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([
      currencyLabel,
      exchangeRatePercentage,
      additionalRate,
      currencySymbol,
      currenncyAlias,
      supportedCountries,
    ]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any admin exists with the adminname
    const currencyExists = await CurrencyModel.findOne({
      currencyLabel: currencyLabel,
    });

    if (currencyExists) {
      return {
        status: 403,
        message: "A currency with the specified label already exists!",
      };
    }

    const newCurrency = await CurrencyModel.create({
      currencyLabel,
      exchangeRatePercentage,
      additionalRate,
      symbol: currencySymbol,
      alias: currenncyAlias,
      supportedCountries,
    });

    const currencies = await CurrencyModel.find({}).sort({ createdAt: -1 });

    return {
      status: 201,
      message: `Currency created successfully~`,
      currencies: currencies,
    };
  }
  // This service UPDATES a currency
  async updateCurrency(
    _id,
    currencyLabel,
    exchangeRatePercentage,
    additionalRate,
    symbol,
    alias,
    supportedCountries
  ) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([
      _id,
      currencyLabel,
      exchangeRatePercentage,
      additionalRate,
      symbol,
      alias,
      supportedCountries,
    ]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Update currency
    const updatedCurrency = await CurrencyModel.findOneAndUpdate(
      { _id },
      {
        currencyLabel,
        exchangeRatePercentage,
        additionalRate,
        symbol,
        alias,
        supportedCountries,
      }
    );

    const currencies = await CurrencyModel.find({}).sort({
      createdAt: -1,
    });

    return {
      status: 201,
      message: `Currency updated successfully!`,
      currencies,
    };
  }

  // This service DELETES a currency
  async deleteCurrency(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any currency exists with the id provided
    const currencyExists = await CurrencyModel.findOneAndDelete({
      _id: _id,
    });

    if (!currencyExists) {
      return {
        status: 404,
        message: "No currency exists with the id specified!",
      };
    }

    const currencies = await CurrencyModel.find({}).sort({
      createdAt: -1,
    });

    return {
      status: 201,
      message: `Currency deleted successfully!`,
      currencies,
    };
  }

  // RATE PER MILE
  // This service sets the rate per mile
  async setRatePerMile(rate, mile, city) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([rate, mile, city]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any RATE PER MILE exists with the specified city
    const rpmExists = await RatePerMileModel.findOne({ city: city });

    console.log("HELLO FROM HERE:::", rpmExists);

    // If there is a document already, update it
    if (rpmExists) {
      const updatedRPM = await RatePerMileModel.findOneAndUpdate(
        { _id: rpmExists?._id },
        { rate, mile, city }
      );
      const updatedRPMs = await RatePerMileModel.find({}).populate("city");
      return {
        status: 201,
        message: `Rate per mile updated successfully!`,
        ratePerMile: updatedRPM,
        ratesPerMile: updatedRPMs,
      };
    }

    const newRPM = await RatePerMileModel.create({
      rate,
      mile,
      city,
    });

    const updatedRPMs = await RatePerMileModel.find({}).populate("city");

    return {
      status: 201,
      message: `Rate per mile updated successfully~`,
      ratePerMile: newRPM,
      ratesPerMile: updatedRPMs,
    };
  }

  // This service DELETES a rate
  async deleteRatePerMile(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any currency exists with the id provided
    const rpmExists = await RatePerMileModel.findOneAndDelete({
      _id: _id,
    });

    if (!rpmExists) {
      return {
        status: 404,
        message: "No rate exists with the id specified!",
      };
    }

    const ratesPerMile = await RatePerMileModel.find({}).populate("city");

    return {
      status: 201,
      message: `Rate deleted successfully!`,
      ratesPerMile,
    };
  }

  // This service GETS all rates per mile
  async getRatesPerMile() {
    // Get rates per mile
    const ratesPerMile = await RatePerMileModel.find({}).populate("city");

    return {
      status: 200,
      message: `Fetched rates.`,
      ratesPerMile: ratesPerMile,
    };
  }

  // VISA ON ARRIVAL RATES
  // This service GETS all visa on arrival rates
  async getVisaOnArrivalRates() {
    // Get visaOnArrivalRates
    const visaOnArrivalRates = await VisaOnArrivalRateModel.find({}).sort({
      createdAt: -1,
    });

    return {
      status: 200,
      message: `Fetched visa on arrival rates.`,
      visaOnArrivalRates: visaOnArrivalRates,
    };
  }
  // This service creates a new visa on arrival rate
  async createNewVisaOnArrivalRate(
    country,
    visaFee,
    isNigerianVisaRequired,
    isBiometricsRequired
  ) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([
      country,
      visaFee,
      isNigerianVisaRequired,
      isBiometricsRequired,
    ]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any admin exists with the adminname
    const countryExists = await VisaOnArrivalRateModel.findOne({
      country: country,
    });

    if (countryExists) {
      return {
        status: 403,
        message: "This country already exists!",
      };
    }

    // Get base fees
    const voaBaseFees = await VoaBaseFeesModel.find();
    if (!voaBaseFees) {
      return {
        status: 404,
        message:
          "You must set the base fees first before performing this action!",
      };
    }

    // Calculate total fees
    let totalFees;
    if (isBiometricsRequired == true) {
      totalFees = Number(
        +voaBaseFees[0]?.transactionFee +
          +voaBaseFees[0]?.processingFee +
          +voaBaseFees[0]?.biometricFee +
          +visaFee
      ).toFixed(2);
    } else {
      totalFees = Number(
        +voaBaseFees[0]?.transactionFee +
          +voaBaseFees[0]?.processingFee +
          +visaFee
      ).toFixed(2);
    }

    // Calculate VAT - 7.5%
    const vat = Number((7.5 / 100) * totalFees).toFixed(2);

    const total = Number(+totalFees + +vat).toFixed(2);

    // Create Visa on arrival rate
    const newVisaOnArrivalRate = await VisaOnArrivalRateModel.create({
      country,
      isNigerianVisaRequired,
      isBiometricsRequired,
      voaBaseFees: voaBaseFees[0]?._id,
      visaFee,
      vat,
      total,
    });

    const visaOnArrivalRates = await VisaOnArrivalRateModel.find({})
      .sort({
        createdAt: -1,
      })
      .populate("voaBaseFees");

    return {
      status: 201,
      message: `Country added successfully!`,
      visaOnArrivalRates,
    };
  }

  // This service UPDATES a visa on arrival rate
  async updateVisaOnArrivalRate(
    _id,
    country,
    visaFee,
    isNigerianVisaRequired,
    isBiometricsRequired,
    voaBaseFeeId
  ) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([
      _id,
      country,
      visaFee,
      isNigerianVisaRequired,
      isBiometricsRequired,
      voaBaseFeeId,
    ]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any visaOnArrivalRate exists with the id provided
    const countryExists = await VisaOnArrivalRateModel.findOne({
      _id: _id,
    });

    if (!countryExists) {
      return {
        status: 404,
        message: "No country / rate exists with the id specified!",
      };
    }

    // Get base fees
    const voaBaseFees = await VoaBaseFeesModel.findOne({ _id: voaBaseFeeId });
    if (!voaBaseFees) {
      return {
        status: 404,
        message:
          "You must set the base fees first before performing this action!",
      };
    }

    // Calculate total fees
    let totalFees;
    if (isBiometricsRequired == true) {
      totalFees = Number(
        +voaBaseFees[0]?.transactionFee +
          +voaBaseFees[0]?.processingFee +
          +voaBaseFees[0]?.biometricFee +
          +visaFee
      ).toFixed(2);
    } else {
      totalFees = Number(
        +voaBaseFees[0]?.transactionFee +
          +voaBaseFees[0]?.processingFee +
          +visaFee
      ).toFixed(2);
    }

    // Calculate VAT - 7.5%
    const vat = Number((7.5 / 100) * totalFees).toFixed(2);

    const total = Number(+totalFees + +vat).toFixed(2);

    // Update Visa on arrival rate
    const updatedVisaOnArrivalRate =
      await VisaOnArrivalRateModel.findOneAndUpdate(
        { _id },
        {
          country,
          visaFee,
          vat,
          total,
          isNigerianVisaRequired,
          isBiometricsRequired,
        }
      );

    const visaOnArrivalRates = await VisaOnArrivalRateModel.find({})
      .sort({
        createdAt: -1,
      })
      .populate("voaBaseFees");

    return {
      status: 201,
      message: `Country rate updated successfully!`,
      visaOnArrivalRates,
    };
  }

  // This service DELETES a visa on arrival rate
  async deleteVisaOnArrivalRate(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any visaOnArrivalRate exists with the id provided
    const countryExists = await VisaOnArrivalRateModel.findOneAndDelete({
      _id: _id,
    });

    if (!countryExists) {
      return {
        status: 404,
        message: "No country / rate exists with the id specified!",
      };
    }

    const visaOnArrivalRates = await VisaOnArrivalRateModel.find({})
      .sort({
        createdAt: -1,
      })
      .populate("voaBaseFees");

    return {
      status: 201,
      message: `Country rate deleted successfully!`,
      visaOnArrivalRates,
    };
  }

  // VOA BASE FEES
  // This service GETS the base fees for visa on arrival
  async getVisaOnArrivalBaseRates() {
    // Get visaOnArrivalBaseRates
    const voaBaseFees = await VoaBaseFeesModel.find({});

    return {
      status: 200,
      message: `Fetched visa on arrival BASE rates.`,
      voaBaseFees: voaBaseFees[0],
    };
  }
  // This service sets the base rates for visa on arrival
  async setVisaOnArrivalBaseRates(
    transactionFee,
    processingFee,
    biometricFee,
    _id
  ) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([
      transactionFee,
      processingFee,
      biometricFee,
      _id,
    ]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any document already exists (CAN ONLY HAVE 1 VOA BASE RATE DOCUMENT)
    const voaBaseRateExists = await VoaBaseFeesModel.findOne({ _id });

    console.log("HELLO FROM HERE:::", voaBaseRateExists);

    // If the voaBaseRate already exists i.e If there is an existing document on the database
    if (voaBaseRateExists) {
      voaBaseRateExists.transactionFee = transactionFee;
      voaBaseRateExists.processingFee = processingFee;
      voaBaseRateExists.biometricFee = biometricFee;

      console.log("HELLO UPDATED VOA BASE FEES:", voaBaseRateExists);
      await voaBaseRateExists.save();

      // Loop through all the visa on arrival rates / countries and update their tax and total fees
      const visaOnArrivalRates = await VisaOnArrivalRateModel.find({});

      let totalFees, vat, total;
      visaOnArrivalRates?.forEach(async (rate) => {
        // Calculate total fees
        totalFees =
          +voaBaseRateExists?.transactionFee +
          +voaBaseRateExists?.processingFee +
          +voaBaseRateExists?.biometricFee +
          +rate?.visaFee;

        // Calculate VAT - 7.5%
        vat = Number((7.5 / 100) * totalFees).toFixed(2);

        total = Number(+totalFees + +vat).toFixed(2);

        rate.total = total;
        rate.vat = vat;

        console.log("TOTAL::", total);
        console.log("VAT::", vat);

        await rate.save();
      });

      const voaRates = await VisaOnArrivalRateModel.find({});
      return {
        status: 201,
        message: `Base rates updated successfully!`,
        voaBaseRates: voaBaseRateExists,
        visaOnArrivalRates: voaRates,
      };
    }

    // If there is no voaBaseRate document on the database, then create one
    const newVoaBaseRate = await VoaBaseFeesModel.create({
      transactionFee,
      processingFee,
      biometricFee,
    });

    return {
      status: 201,
      message: `Base rates updated successfully!`,
      voaBaseRates: newVoaBaseRate,
    };
  }

  // This service GETS an admin by their id
  async getAdminById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any admin exists with the adminname
    const admin = await this.AdminModel.findOne({
      _id: _id,
    }).populate({
      path: "bookings",
    });

    if (!admin) {
      return {
        status: 404,
        message: "No admin exists with the id specified.",
        admin: admin,
      };
    }

    return {
      status: 200,
      message: `Fetched admin with id ${_id}.`,
      admin: admin,
    };
  }

  // This service DELETES admin by email
  // TO-DO: Send OTP along with the email to verify the admin is actually sending the request to delete his/her account
  async deleteAdminByEmail(email) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([email]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any admin exists with the email
    const admin = await this.AdminModel.findOneAndRemove({ email: email });

    if (!admin) {
      return {
        status: 404,
        message: `No admin with email ${email} exists.`,
      };
    }

    return {
      status: 201,
      message: `Admin with email ${email} has been deleted successfully.`,
    };
  }

  // This service UPDATES a admin by id
  async updateAdminById(_id, updatedAdmin) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, updatedAdmin]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any admin exists with the _id
    const admin = await this.AdminModel.findOneAndUpdate(
      { _id: _id },
      { ...updatedAdmin }
    );

    if (!admin) {
      return {
        status: 404,
        message: `No admin with _id ${_id} exists.`,
      };
    }

    return {
      status: 201,
      message: `Admin with _id ${_id} has been updated successfully.`,
    };
  }
}
