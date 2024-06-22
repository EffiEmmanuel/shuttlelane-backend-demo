// @ts-nocheck
import bcrypt from "bcryptjs";
import {
  validateFields,
  validateDriverLoginDetails,
  generateVerificationCode,
  jwtSign,
} from "../util/auth.helper.js";
import jsonwebtoken from "jsonwebtoken";
import { checkDriverEmailValidity } from "../util/db.helper.js";
import PaymentModel from "../model/payment.model.js";
import BookingModel from "../model/booking.model.js";
import { sendEmail, sendSGDynamicEmail } from "../util/sendgrid.js";
import shortid from "shortid";
import VerificationModel from "../model/verification.model.js";
import { sendSMS } from "../util/twilio.js";
import VerificationService from "./VerificationService.js";
import DriverSignupConfirmationEmail from "../emailTemplates/driverEmailTemplates/DriverSignupEmail/index.js";
import ReactDOMServer from "react-dom/server";
import AdminRejectedBookingEmailTemplate from "../emailTemplates/adminEmailTemplates/AdminRejectedBookingEmail/index.js";
import AdminAcceptedBookingEmailTemplate from "../emailTemplates/adminEmailTemplates/AdminAcceptedBookingEmail/index.js";
import UserBookingScheduledConfirmation from "../emailTemplates/userEmailTemplates/UserBookingScheduledEmail/index.js";
import DriverAcceptedBookingEmailTemplate from "../emailTemplates/driverEmailTemplates/DriverAcceptedBookingEmail/index.js";
import DriverFirstTimeBookingEmailTemplate from "../emailTemplates/driverEmailTemplates/DriverFirstTimeBookingEmail/index.js";
import moment from "moment";
import AdminDriverEnRouteEmailTemplate from "../emailTemplates/adminEmailTemplates/AdminDriverEnrouteEmail/index.js";
import UserDriverStartedBookingEmailTemplate from "../emailTemplates/userEmailTemplates/UserDriverStartedBookingEmail/index.js";
import AdminBookingEndedEmailTemplate from "../emailTemplates/adminEmailTemplates/AdminBookingEndedEmail/index.js";
import UserBookingCompletedEmailTemplate from "../emailTemplates/userEmailTemplates/UserBookingCompletedEmail/index.js";
import {
  generateBookingDetails,
  generateUserBookingDetails,
} from "../util/index.js";

const verificationService = new VerificationService(VerificationModel);

export default class DriverService {
  constructor(ShuttlelaneDriverModel) {
    this.DriverModel = ShuttlelaneDriverModel;
  }

  // This service CREATES a new driver - Sign up service
  async signupDriver(driver) {
    console.log("DRIVER:", driver);
    // Check if driver is already signed up
    const driverAlreadyExistsWithEmail = await checkDriverEmailValidity(
      driver.email
    );

    // If driver email already exists
    if (driverAlreadyExistsWithEmail.status === 409)
      return driverAlreadyExistsWithEmail;

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(driver.password, salt);

    console.log("hp:", hashedPassword);

    // If the email is available, then proceed to sign up the driver
    const newDriver = await this.DriverModel.create({
      ...driver,
      password: hashedPassword,
      phoneVerification: false,
    });

    // TO-DO: Send confirmation email here
    const dynamicTemplateData = {
      driverName: `${newDriver?.firstName} ${newDriver?.lastName}`,
    };

    const templateId = "d-a9a55f4aa0fe4c7094ea29610d66c4f1";

    const msg = {
      to: newDriver?.email,
      from: "info@shuttlelane.com",
      subject: `Driver Account Created Successfully🎉`,
      templateId: templateId,
      dynamicTemplateData,
    };

    await sendSGDynamicEmail(msg);

    // TO-DO: Send phone verification SMS here
    // Generate verification code
    const smsVerificationCode = generateVerificationCode(4); // '4' refers to the
    // Add verification code to the verification model
    const verificationRecord = await VerificationModel.create({
      userId: newDriver?._id,
      code: smsVerificationCode,
    });
    // Update Driver document to include the verification
    const driverVerification = await this.DriverModel.findOneAndUpdate(
      { _id: newDriver?._id },
      {
        phoneVerification: true,
      }
    );

    // Send sms
    const smsMessage = `Welcome to Shuttlelane! Use this code to verify your phone number: ${smsVerificationCode}`;
    await sendSMS(newDriver.mobile, smsMessage)
      .then((res) => console.log("SMS sent successfully!"))
      .catch((err) =>
        console.log(
          "An error occured while sending the verification SMS => ",
          err
        )
      );

    const token = jwtSign(newDriver);
    return {
      status: 201,
      message: "Your account has been created successfully!",
      driver: newDriver,
      token: token,
    };
  }

  // This service logs in the driver
  async loginDriver(email, password) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([email, password]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // If the fields are not empty, check the DB for email
    const driverExists = await validateDriverLoginDetails(email, password);

    // TODO: If driver has 2FA turned on, Send OTP to driver's email
    // return {
    //     status: 200,
    //     message: 'An OTP was sent to your registered email.'
    // }

    return driverExists;
  }

  // This service GETS a driver by their email
  async getDriverByEmail(email) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([email]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any driver exists with the email
    const driver = await this.DriverModel.findOne({
      email: email,
    }).populate({
      path: "bookings",
    });

    if (!driver) {
      return {
        status: 404,
        message: "No driver exists with the email specified.",
        driver: driver,
      };
    }

    return {
      status: 200,
      message: `Fetched driver with email ${email}.`,
      driver: driver,
    };
  }

  // This service GETS a driver by their id
  async getDriverById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any driver exists with the drivername
    const driver = await this.DriverModel.findOne({
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

  // This service DELETES driver by email
  // TO-DO: Send OTP along with the email to verify the driver is actually sending the request to delete his/her account
  async deleteDriverByEmail(email) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([email]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any driver exists with the email
    const driver = await this.DriverModel.findOneAndRemove({ email: email });

    if (!driver) {
      return {
        status: 404,
        message: `No driver with email ${email} exists.`,
      };
    }

    return {
      status: 201,
      message: `Driver with email ${email} has been deleted successfully.`,
    };
  }

  // This service DELETES driver by id
  async deleteDriverById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any driver exists with the _id
    const driver = await this.DriverModel.findOneAndRemove({ _id: _id });

    if (!driver) {
      return {
        status: 404,
        message: `No driver with _id ${_id} exists.`,
      };
    }

    return {
      status: 201,
      message: `Driver with _id ${_id} has been deleted successfully.`,
    };
  }

  // This service UPDATES a driver by id
  async updateDriverById(_id, updatedDriver) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, updatedDriver]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any driver exists with the _id
    const driver = await this.DriverModel.findOne({ _id: _id });
    if (!driver) {
      return {
        status: 404,
        message: `No driver with _id ${_id} exists.`,
      };
    }

    let updatedDriverDoc;
    let isMobileDifferent = false;

    // If the user changes their phone number, they should be required to verify it again
    if (updatedDriver?.mobile && updatedDriver?.mobile !== driver?.mobile) {
      updatedDriverDoc = await this.DriverModel.findOneAndUpdate(
        { _id: _id },
        { ...updatedDriver, phoneVerification: false }
      );
      isMobileDifferent = true;
    } else {
      updatedDriverDoc = await this.DriverModel.findOneAndUpdate(
        { _id: _id },
        { ...updatedDriver }
      );
    }

    const updatedDriverAccount = await this.DriverModel.findOne({ _id: _id });
    const token = jwtSign(updatedDriverAccount);

    return {
      status: 201,
      message: isMobileDifferent
        ? `Your account has been updated successfully. Please verify your phone number again.`
        : `Your account has been updated successfully.`,
      driver: updatedDriverAccount,
      token,
    };
  }

  // This service GETS all driver's completed jobs
  async getDriverCompletedJobs(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Fetch all bookings with the _id provided
    const driverCompletedBookings = await BookingModel.find({
      assignedDriver: _id,
      bookingStatus: "Completed",
    })
      .populate("booking")
      .sort({ createdAt: -1 });

    return {
      status: 200,
      message: `All driver's completed bookings have been fetched successfully.`,
      bookings: driverCompletedBookings,
    };
  }

  // This service GETS all driver's assigned jobs
  async getDriverAssignedJobs(_id) {
    console.log("HI I AM HERE NOW:", _id);
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Fetch all bookings with the _id provided
    const driverAssignedBookings = await BookingModel.find({
      driverJobWasSentTo: _id,
      hasDriverAccepted: false,
      hasDriverDeclined: false,
    }).populate("booking");

    return {
      status: 200,
      message: `All driver's assigned bookings have been fetched successfully.`,
      bookings: driverAssignedBookings,
    };
  }

  // This service GETS all driver's assigned jobs
  async getDriverUpcomingJobs(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Fetch all bookings with the _id provided
    const driverUpcomingBookings = await BookingModel.find({
      driverJobWasSentTo: _id,
      hasDriverAccepted: true,
      hasDriverDeclined: false,
      bookingStatus: "Scheduled",
    }).populate("booking");

    return {
      status: 200,
      message: `All driver's upcoming bookings have been fetched successfully.`,
      bookings: driverUpcomingBookings,
    };
  }

  // This service GETS all driver's assigned jobs
  async getDriverOngoingJobs(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Fetch all bookings with the _id provided
    const driverOngoingBookings = await BookingModel.find({
      driverJobWasSentTo: _id,
      hasDriverAccepted: true,
      hasDriverDeclined: false,
      bookingStatus: "Ongoing",
    })
      .populate("booking")
      .sort({ createdAt: -1 });

    return {
      status: 200,
      message: `All driver's upcoming bookings have been fetched successfully.`,
      bookings: driverOngoingBookings,
    };
  }

  // This service GETS the driver's bookings the driver id
  async getDriverBookingsByDriverId(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Fetch all bookings with the _id provided
    const bookings = await BookingModel.find({ driver: _id });

    return {
      status: 200,
      message: `All driver's bookings have been fetched successfully.`,
      bookings: bookings,
    };
  }

  async acceptJob(driverId, bookingId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([driverId, bookingId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any driver exists with the _id
    const driver = await this.DriverModel.findOne({ _id: driverId }).populate(
      "bookingsAssignedTo"
    );
    if (!driver) {
      return {
        status: 404,
        message: `No driver with _id ${driverId} exists.`,
      };
    }

    // Check if any booking exists with the _id
    const bookingExists = await BookingModel.findOne({
      _id: bookingId,
    })
      .populate("booking")
      .populate("assignedCar")
      .populate("driverJobWasSentTo")
      .populate("vendorAssignedDriver")
      .populate("assignedDriver")
      .populate("bookingCurrency")
      .populate("user");
    if (!bookingExists) {
      return {
        status: 404,
        message: `No booking with _id ${bookingId} exists.`,
      };
    }

    // Check if any driver exists with the _id
    const driverExists = await this.DriverModel.findOne({
      _id: driverId,
    }).populate("bookingsAssignedTo");
    if (!driverExists) {
      return {
        status: 404,
        message: `No driver with _id ${driverId} exists.`,
      };
    }

    // Update booking to "ACCEPT" job
    const acceptBooking = await BookingModel.findOneAndUpdate(
      { _id: bookingId },
      {
        bookingStatus: "Scheduled",
        isAssignedToDriver: true,
        isAssignedToVendor: false,
        assignedDriver: driverId,
        hasDriverAccepted: true,
      }
    )
      .populate("assignedDriver")
      .populate("driverJobWasSentTo")
      .populate("user");

    // Update driver schema
    driverExists?.bookingsAssignedTo?.push(bookingId);
    await driverExists.save();

    // Send a notification to the admin
    const adminEmailHTML = AdminAcceptedBookingEmailTemplate({
      bookingReference: bookingExists?.booking?.bookingReference,
      pickupDate: moment(bookingExists?.booking?.pickupDate).format(
        "MMM DD, YYYY"
      ),
      pickupTime: moment(bookingExists?.booking?.pickupTime).format("H:MM A"),
      pickupLocation: bookingExists?.booking?.pickupAddress,
      driverName: `${
        bookingExists?.assignedDriver?.firstName ??
        bookingExists?.driverJobWasSentTo?.firstName
      } ${
        bookingExists?.assignedDriver?.lastName ??
        bookingExists?.driverJobWasSentTo?.lastName
      }`,
      driverMobile:
        bookingExists?.assignedDriver?.mobile ??
        bookingExists?.driverJobWasSentTo?.mobile,
      passengerName: `${
        bookingExists?.user?.firstName ?? bookingExists?.firstName
      } ${bookingExists?.user?.lastName ?? bookingExists?.lastName}`,
      passengerMobile: bookingExists?.user?.mobile ?? bookingExists?.mobile,
    });

    const adminMessage = {
      to: "info@shuttlelane.com",
      //   to: "effiemmanuel.n@gmail.com",
      from: process.env.SENGRID_EMAIL,
      subject: `Booking Confirmation: ${bookingExists?.bookingReference}`,
      html: ReactDOMServer.renderToString(adminEmailHTML),
    };
    sendEmail(adminMessage);

    console.log("BOOKIGNS ASSIGNED TO 7:");

    // Send a notification to the user
    const userBookingDetails = await generateUserBookingDetails(bookingExists);
    let dynamicTemplateData = {
      bookingReference: bookingExists?.bookingReference,
      title: `${bookingExists?.title ?? bookingExists?.user?.title}`,
      firstName: `${
        bookingExists?.firstName ?? bookingExists?.user?.firstName
      }`,
      bookingDetails: userBookingDetails,
    };

    const msg = {
      to: bookingExists?.email ?? bookingExists?.user?.email,
      from: "booking@shuttlelane.com",
      subject: "Your Booking Has Been Scheduled",
      templateId: "d-07c6b4b45f944ef38c55af74685e7143",
      dynamicTemplateData,
    };

    await sendSGDynamicEmail(msg);

    // Send a notification to the driver
    const booking = await BookingModel.findOne({ _id: bookingId });
    let bookingDetails = await generateBookingDetails(booking);
    // TO-DO: Send confirmation email here
    dynamicTemplateData = {
      driverName: `${driverExists?.firstName} ${driverExists?.lastName}`,
      bookingDetails: bookingDetails,
    };

    msg = {
      to: driverExists?.email,
      from: "booking@shuttlelane.com",
      subject: `Booking Confirmation: ${bookingExists?.bookingReference}`,
      templateId: "d-373023cee4eb4b9b8ad2c5e121bd0354",
      dynamicTemplateData,
    };

    await sendSGDynamicEmail(msg);

    // Send a notification to the driver if this is his first booking on shuttlelane
    if (driverExists?.bookingsAssignedTo?.length === 1) {
      dynamicTemplateData = {
        driverName: `${driverExists?.firstName} ${driverExists?.lastName}`,
      };

      msg = {
        to: driverExists?.email,
        from: "booking@shuttlelane.com",
        subject: `Congratulations on accepting your first booking!🎉`,
        templateId: templateId,
        dynamicTemplateData,
      };

      await sendSGDynamicEmail(msg);
    }

    // Fetch all upcoming bookings with the _id provided
    const driverUpcomingBookings = await BookingModel.find({
      driverJobWasSentTo: driverId,
      hasDriverAccepted: true,
      hasDriverDeclined: false,
      bookingStatus: "Scheduled",
    }).populate("booking");

    // Fetch all bookings with the _id provided
    const driverAssignedBookings = await BookingModel.find({
      driverJobWasSentTo: driverId,
      hasDriverAccepted: false,
      hasDriverDeclined: false,
    }).populate("booking");

    return {
      status: 201,
      assignedBookings: driverAssignedBookings,
      upcomingBookings: driverUpcomingBookings,
      message:
        "Booking has been accepted! Be sure to arrive on time and drive safely.",
    };
  }

  async declineJob(driverId, bookingId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([driverId, bookingId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any driver exists with the _id
    const driver = await this.DriverModel.findOne({ _id: driverId });
    if (!driver) {
      return {
        status: 404,
        message: `No driver with _id ${driverId} exists.`,
      };
    }

    // Check if any booking exists with the _id
    const bookingExists = await BookingModel.findOne({
      _id: bookingId,
    })
      .populate("booking")
      .populate("driverJobWasSentTo");
    if (!bookingExists) {
      return {
        status: 404,
        message: `No booking with _id ${bookingId} exists.`,
      };
    }

    // Update booking to "DECLINE" job
    const declineBooking = await BookingModel.findOneAndUpdate(
      { _id: bookingId },
      {
        bookingStatus: "Not yet assigned",
        isAssignedToDriver: false,
        isAssignedToVendor: false,
        hasDriverAccepted: false,
        hasDriverDeclined: true,
      }
    );

    // Send a notification to the admin
    const emailHTML = AdminRejectedBookingEmailTemplate({
      bookingReference: bookingExists?.booking?.bookingReference,
      pickupDate: moment(bookingExists?.booking?.pickupDate).format(
        "MMM DD, YYYY"
      ),
      pickupTime: moment(bookingExists?.booking?.pickupTime).format("H:MM A"),
      pickupLocation: bookingExists?.booking?.pickupAddress,
      passengerName: `${
        bookingExists?.user?.firstName ?? bookingExists?.firstName
      } ${bookingExists?.user?.lastName ?? bookingExists?.lastName}`,
      passengerMobile: bookingExists?.user?.mobile ?? bookingExists?.mobile,
      isVendor: false,
      driverName: `${bookingExists?.driverJobWasSentTo?.firstName} ${bookingExists?.driverJobWasSentTo?.lastName}`,
    });

    const message = {
      to: "info@shuttlelane.com",
      //   to: "effiemmanuel.n@gmail.com",
      from: process.env.SENGRID_EMAIL,
      subject: `Booking Rejected: ${bookingExists?.bookingReference}`,
      html: ReactDOMServer.renderToString(emailHTML),
    };
    sendEmail(message);

    // Fetch all upcoming bookings with the _id provided
    const driverUpcomingBookings = await BookingModel.find({
      driverJobWasSentTo: driverId,
      hasDriverAccepted: true,
      hasDriverDeclined: false,
      bookingStatus: "Scheduled",
    }).populate("booking");

    // Fetch all bookings with the _id provided
    const driverAssignedBookings = await BookingModel.find({
      driverJobWasSentTo: driverId,
      hasDriverAccepted: false,
      hasDriverDeclined: false,
    }).populate("booking");

    return {
      status: 201,
      assignedBookings: driverAssignedBookings,
      upcomingBookings: driverUpcomingBookings,
      message: "Booking has been successfully rejected.",
    };
  }

  // This service GETS a driver's earnings
  async getDriverEarnings(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Fetch all ONGOING bookings with the _id provided
    const driverOngoingBookings = await BookingModel.find({
      driverJobWasSentTo: _id,
      hasDriverAccepted: true,
      hasDriverDeclined: false,
      bookingStatus: "Ongoing",
    });

    // Fetch all SCHEDULED bookings with the _id provided
    const driverScheduledBookings = await BookingModel.find({
      driverJobWasSentTo: _id,
      hasDriverAccepted: true,
      hasDriverDeclined: false,
      bookingStatus: "Scheduled",
    });

    // Fetch all COMPLETED bookings with the _id provided
    const driverCompletedBookings = await BookingModel.find({
      driverJobWasSentTo: _id,
      hasDriverAccepted: true,
      hasDriverDeclined: false,
      bookingStatus: "Completed",
    });

    // Calculate Ongoing + Scheduled as the "Expected earnings"
    let expectedEarnings = 0;
    driverOngoingBookings?.forEach((booking) => {
      expectedEarnings =
        Number(booking?.bookingRate) + Number(expectedEarnings);
    });

    console.log("EXPECTED EARNINGS 1:", expectedEarnings);

    driverScheduledBookings?.forEach((booking) => {
      console.log("EE FUNC 2:", booking?.bookingRate);
      expectedEarnings =
        Number(booking?.bookingRate) + Number(expectedEarnings);
    });

    console.log("EXPECTED EARNINGS 2:", expectedEarnings);

    // Calculate Completed as "Earned"
    let earnings = 0;
    driverCompletedBookings?.forEach((booking) => {
      earnings = Number(booking?.bookingRate) + Number(earnings);
    });

    console.log("EARNINGS 1:", earnings);

    return {
      status: 200,
      message: `All driver's earnings have been fetched successfully.`,
      expectedEarnings,
      earnings,
    };
  }

  async startBooking(driverId, bookingId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([driverId, bookingId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    console.log("BOOKIGNS ASSIGNED TO 2:");

    // Check if any booking exists with the _id
    const bookingExists = await BookingModel.findOne({
      _id: bookingId,
    })
      .populate("booking")
      .populate("assignedDriver")
      .populate("driverJobWasSentTo")
      .populate("user");
    if (!bookingExists) {
      return {
        status: 404,
        message: `No booking with _id ${bookingId} exists.`,
      };
    }

    console.log("BOOKIGNS ASSIGNED TO 3:");

    // Check if any driver exists with the _id
    const driverExists = await this.DriverModel.findOne({
      _id: driverId,
    }).populate("bookingsAssignedTo");
    if (!driverExists) {
      return {
        status: 404,
        message: `No driver with _id ${driverId} exists.`,
      };
    }

    console.log("BOOKIGNS ASSIGNED TO 4:");
    // Update booking to "ONGOING"
    const updateBooking = await BookingModel.findOneAndUpdate(
      { _id: bookingId },
      {
        bookingStatus: "Ongoing",
      }
    )
      .populate("assignedDriver")
      .populate("driverJobWasSentTo")
      .populate("user");

    console.log("BOOKIGNS ASSIGNED TO 6:");

    // Send a notification to the admin
    const adminEmailHTML = AdminDriverEnRouteEmailTemplate({
      bookingReference: bookingExists?.booking?.bookingReference,
      driverName: `${
        bookingExists?.assignedDriver?.firstName ??
        bookingExists?.driverJobWasSentTo?.firstName
      } ${
        bookingExists?.assignedDriver?.lastName ??
        bookingExists?.driverJobWasSentTo?.lastName
      }`,
      driverContact:
        bookingExists?.assignedDriver?.mobile ??
        bookingExists?.driverJobWasSentTo?.mobile,
    });
    const adminMessage = {
      to: "info@shuttlelane.com",
      //   to: "effiemmanuel.n@gmail.com",
      from: process.env.SENGRID_EMAIL,
      subject: `Driver En Route: ${bookingExists?.bookingReference}`,
      html: ReactDOMServer.renderToString(adminEmailHTML),
    };
    sendEmail(adminMessage);

    // Send a notification to the user
    const userDynamicTemplateData = {
      bookingReference: bookingExists?.bookingReference,
      title: `${bookingExists?.title ?? bookingExists?.user?.title}`,
      firstName: `${
        bookingExists?.firstName ?? bookingExists?.user?.firstName
      }`,
      driverName: bookingExists?.isAssignedToDriver
        ? `${
            bookingExists?.assignedDriver?.firstName ??
            bookingExists?.driverJobWasSentTo?.firstName
          } ${
            bookingExists?.assignedDriver?.lastName ??
            bookingExists?.driverJobWasSentTo?.lastName
          }`
        : `${bookingExists?.vendorAssignedDriver?.firstName} ${bookingExists?.vendorAssignedDriver?.lastName}`,
      driverContact: bookingExists?.isAssignedToDriver
        ? `${
            bookingExists?.assignedDriver?.mobile ??
            bookingExists?.driverJobWasSentTo?.mobile
          }`
        : `${bookingExists?.vendorAssignedDriver?.mobile}`,
    };
    const msg = {
      to: bookingExists?.email ?? bookingExists?.user?.email,
      from: "booking@shuttlelane.com",
      subject: "Your Trip Has Started",
      templateId: "d-84451cd8238642418957e4c1f21bdfa3",
      dynamicTemplateData: userDynamicTemplateData,
    };
    await sendSGDynamicEmail(msg);

    // Fetch all upcoming bookings with the _id provided
    const driverUpcomingBookings = await BookingModel.find({
      driverJobWasSentTo: driverId,
      hasDriverAccepted: true,
      hasDriverDeclined: false,
      bookingStatus: "Scheduled",
    })
      .populate("booking")
      .sort({ createdAt: -1 });

    // Fetch all bookings with the _id provided
    const driverAssignedBookings = await BookingModel.find({
      driverJobWasSentTo: driverId,
      hasDriverAccepted: false,
      hasDriverDeclined: false,
    })
      .populate("booking")
      .sort({ createdAt: -1 });

    // Fetch all bookings with the _id provided
    const driverOngoingBookings = await BookingModel.find({
      driverJobWasSentTo: driverId,
      bookingStatus: "Ongoing",
    })
      .populate("booking")
      .sort({ createdAt: -1 });

    return {
      status: 201,
      assignedBookings: driverAssignedBookings,
      upcomingBookings: driverUpcomingBookings,
      ongoingBookings: driverOngoingBookings,
      message:
        "Booking has started! Be sure to arrive on time and drive safely.",
    };
  }

  async endBooking(driverId, bookingId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([driverId, bookingId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    console.log("BOOKIGNS ASSIGNED TO 2:");

    // Check if any booking exists with the _id
    const bookingExists = await BookingModel.findOne({
      _id: bookingId,
    }).populate("booking");
    if (!bookingExists) {
      return {
        status: 404,
        message: `No booking with _id ${bookingId} exists.`,
      };
    }

    console.log("BOOKIGNS ASSIGNED TO 3:");

    // Check if any driver exists with the _id
    const driverExists = await this.DriverModel.findOne({
      _id: driverId,
    }).populate("bookingsAssignedTo");
    if (!driverExists) {
      return {
        status: 404,
        message: `No driver with _id ${driverId} exists.`,
      };
    }

    console.log("BOOKIGNS ASSIGNED TO 4:");
    // Update booking to "ONGOING"
    const updateBooking = await BookingModel.findOneAndUpdate(
      { _id: bookingId },
      {
        bookingStatus: "Completed",
      }
    )
      .populate("assignedDriver")
      .populate("driverJobWasSentTo")
      .populate("user");

    console.log("BOOKIGNS ASSIGNED TO 6:");

    // Send a notification to the admin
    const adminEmailHTML = AdminBookingEndedEmailTemplate({
      bookingReference: bookingExists?.booking?.bookingReference,
      isVendor: false,
      driver: driverExists,
      bookingRate: `₦${bookingExists?.booking?.bookingRate}`,
    });

    const adminMessage = {
      //   to: "info@shuttlelane.com",
      to: "effiemmanuel.n@gmail.com",
      from: process.env.SENGRID_EMAIL,
      subject: `Trip Ended: ${bookingExists?.bookingReference}`,
      html: ReactDOMServer.renderToString(adminEmailHTML),
    };
    sendEmail(adminMessage);

    // Send a notification to the user
    const userDynamicTemplateData = {
      bookingReference: bookingExists?.bookingReference,
      title: `${bookingExists?.title ?? bookingExists?.user?.title}`,
      firstName: `${
        bookingExists?.firstName ?? bookingExists?.user?.firstName
      }`,
    };
    const msg = {
      to: bookingExists?.email ?? bookingExists?.user?.email,
      from: "booking@shuttlelane.com",
      subject: "Your Trip Has Ended",
      templateId: "d-6cd9d47d40944a91939e14af431a8a85",
      dynamicTemplateData: userDynamicTemplateData,
    };
    await sendSGDynamicEmail(msg);

    // Fetch all upcoming bookings with the _id provided
    const driverUpcomingBookings = await BookingModel.find({
      driverJobWasSentTo: driverId,
      hasDriverAccepted: true,
      hasDriverDeclined: false,
      bookingStatus: "Scheduled",
    }).populate("booking");

    // Fetch all bookings with the _id provided
    const driverAssignedBookings = await BookingModel.find({
      driverJobWasSentTo: driverId,
      hasDriverAccepted: false,
      hasDriverDeclined: false,
    }).populate("booking");

    // Fetch all bookings with the _id provided
    const driverOngoingBookings = await BookingModel.find({
      driverJobWasSentTo: driverId,
      bookingStatus: "Ongoing",
    }).populate("booking");

    // Fetch all bookings with the _id provided
    const driverCompletedBookings = await BookingModel.find({
      driverJobWasSentTo: driverId,
      bookingStatus: "Completed",
    }).populate("booking");

    return {
      status: 201,
      assignedBookings: driverAssignedBookings,
      upcomingBookings: driverUpcomingBookings,
      ongoingBookings: driverOngoingBookings,
      completedBookings: driverCompletedBookings,
      message: "Booking ended successfully",
    };
  }
}
