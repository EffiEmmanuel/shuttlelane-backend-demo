// @ts-nocheck
import bcrypt from "bcryptjs";
import {
  validateFields,
  validateVendorLoginDetails,
  generateVerificationCode,
  jwtSign,
} from "../util/auth.helper.js";
import jsonwebtoken from "jsonwebtoken";
import {
  checkVendorDriverEmailValidity,
  checkVendorEmailValidity,
} from "../util/db.helper.js";
import PaymentModel from "../model/payment.model.js";
import BookingModel from "../model/booking.model.js";
import { sendEmail } from "../util/sendgrid.js";
import shortid from "shortid";
import VerificationModel from "../model/verification.model.js";
import { sendSMS } from "../util/twilio.js";
import VerificationService from "./VerificationService.js";
import VendorSignupConfirmationEmail from "../emailTemplates/vendorEmailTemplates/VendorSignupEmail/index.js";
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
import VendorDriverModel from "../model/vendorDriver.model.js";
import DriverSignupConfirmationEmail from "../emailTemplates/driverEmailTemplates/DriverSignupEmail/index.js";
import VendorFleetModel from "../model/vendorFleet.model.js";

const verificationService = new VerificationService(VerificationModel);

export default class VendorService {
  constructor(ShuttlelaneVendorModel) {
    this.VendorModel = ShuttlelaneVendorModel;
  }

  // This service CREATES a new vendor - Sign up service
  async signupVendor(vendor) {
    console.log("VENDOR:", vendor);
    // Check if vendor is already signed up
    const vendorAlreadyExistsWithEmail = await checkVendorEmailValidity(
      vendor.contactEmail
    );

    // If vendor email already exists
    if (vendorAlreadyExistsWithEmail.status === 409)
      return vendorAlreadyExistsWithEmail;

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(vendor.password, salt);

    console.log("hp:", hashedPassword);

    // If the email is available, then proceed to sign up the vendor
    const newVendor = await this.VendorModel.create({
      ...vendor,
      password: hashedPassword,
      phoneVerification: false,
    });

    // TO-DO: Send confirmation email here

    const emailHTML = VendorSignupConfirmationEmail({
      vendor: newVendor,
    });

    const message = {
      to: vendor?.companyEmail,
      from: process.env.SENGRID_EMAIL,
      subject: "Vendor Account Created Successfully🎉",
      html: ReactDOMServer.renderToString(emailHTML),
    };
    await sendEmail(message);

    // TO-DO: Send phone verification SMS here
    // Generate verification code
    const smsVerificationCode = generateVerificationCode(4); // '4' refers to the
    // Add verification code to the verification model
    const verificationRecord = await VerificationModel.create({
      userId: newVendor?._id,
      code: smsVerificationCode,
    });
    // Update Vendor document to include the verification
    // const vendorVerification = await this.VendorModel.findOneAndUpdate(
    //   { _id: newVendor?._id },
    //   {
    //     phoneVerification: true,
    //   }
    // );

    // Send sms
    const smsMessage = `Welcome to Shuttlelane! Use this code to verify your phone number: ${smsVerificationCode}`;
    await sendSMS(newVendor.contactMobile, smsMessage)
      .then((res) => console.log("SMS sent successfully!"))
      .catch((err) =>
        console.log(
          "An error occured while sending the verification SMS => ",
          err
        )
      );

    console.log("VERIFICATION CODE:", smsVerificationCode);

    const token = jwtSign(newVendor);
    return {
      status: 201,
      message: "Your account has been created successfully!",
      vendor: newVendor,
      token: token,
    };
  }

  // This service logs in the vendor
  async loginVendor(email, password) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([email, password]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // If the fields are not empty, check the DB for email
    const vendorExists = await validateVendorLoginDetails(email, password);

    // TODO: If vendor has 2FA turned on, Send OTP to vendor's email
    // return {
    //     status: 200,
    //     message: 'An OTP was sent to your registered email.'
    // }

    return vendorExists;
  }

  // This service GETS a vendor by their email
  async getVendorByEmail(email) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([email]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any vendor exists with the email
    const vendor = await this.VendorModel.findOne({
      email: email,
    }).populate({
      path: "bookings",
    });

    if (!vendor) {
      return {
        status: 404,
        message: "No vendor exists with the email specified.",
        vendor: vendor,
      };
    }

    return {
      status: 200,
      message: `Fetched vendor with email ${email}.`,
      vendor: vendor,
    };
  }

  // This service GETS a vendor by their id
  async getVendorById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any vendor exists with the vendorname
    const vendor = await this.VendorModel.findOne({
      _id: _id,
    }).populate({
      path: "bookings",
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

  // This service DELETES vendor by email
  // TO-DO: Send OTP along with the email to verify the vendor is actually sending the request to delete his/her account
  async deleteVendorByEmail(email) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([email]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any vendor exists with the email
    const vendor = await this.VendorModel.findOneAndRemove({ email: email });

    if (!vendor) {
      return {
        status: 404,
        message: `No vendor with email ${email} exists.`,
      };
    }

    return {
      status: 201,
      message: `Vendor with email ${email} has been deleted successfully.`,
    };
  }

  // This service DELETES vendor by id
  async deleteVendorById(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any vendor exists with the _id
    const vendor = await this.VendorModel.findOneAndRemove({ _id: _id });

    if (!vendor) {
      return {
        status: 404,
        message: `No vendor with _id ${_id} exists.`,
      };
    }

    return {
      status: 201,
      message: `Vendor with _id ${_id} has been deleted successfully.`,
    };
  }

  // This service UPDATES a vendor by id
  async updateVendorById(_id, updatedVendor) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id, updatedVendor]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any vendor exists with the _id
    const vendor = await this.VendorModel.findOne({ _id: _id });
    if (!vendor) {
      return {
        status: 404,
        message: `No vendor with _id ${_id} exists.`,
      };
    }

    let updatedVendorDoc;
    let isMobileDifferent = false;

    // If the user changes their phone number, they should be required to verify it again
    if (updatedVendor?.mobile && updatedVendor?.mobile !== vendor?.mobile) {
      updatedVendorDoc = await this.VendorModel.findOneAndUpdate(
        { _id: _id },
        { ...updatedVendor, phoneVerification: false }
      );
      isMobileDifferent = true;
    } else {
      updatedVendorDoc = await this.VendorModel.findOneAndUpdate(
        { _id: _id },
        { ...updatedVendor }
      );
    }

    const updatedVendorAccount = await this.VendorModel.findOne({ _id: _id });
    const token = jwtSign(updatedVendorAccount);

    return {
      status: 201,
      message: isMobileDifferent
        ? `Your account has been updated successfully. Please verify your phone number again.`
        : `Your account has been updated successfully.`,
      vendor: updatedVendorAccount,
      token,
    };
  }

  // This service GETS all vendor's completed jobs
  async getVendorCompletedJobs(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Fetch all bookings with the _id provided
    const vendorCompletedBookings = await BookingModel.find({
      assignedVendor: _id,
      bookingStatus: "Completed",
    })
      .populate("booking")
      .sort({ createdAt: -1 });

    return {
      status: 200,
      message: `All vendor's completed bookings have been fetched successfully.`,
      bookings: vendorCompletedBookings,
    };
  }

  // This service GETS all vendor's assigned jobs
  async getVendorAssignedJobs(_id) {
    console.log("HI I AM HERE NOW:", _id);
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Fetch all bookings with the _id provided
    const vendorAssignedBookings = await BookingModel.find({
      vendorJobWasSentTo: _id,
      hasVendorAccepted: false,
      hasVendorDeclined: false,
    }).populate("booking");

    return {
      status: 200,
      message: `All vendor's assigned bookings have been fetched successfully.`,
      bookings: vendorAssignedBookings,
    };
  }

  // This service GETS all vendor's assigned jobs
  async getVendorUpcomingJobs(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Fetch all bookings with the _id provided
    const vendorUpcomingBookings = await BookingModel.find({
      vendorJobWasSentTo: _id,
      hasVendorAccepted: true,
      hasVendorDeclined: false,
      bookingStatus: "Scheduled",
    }).populate("booking");

    return {
      status: 200,
      message: `All vendor's upcoming bookings have been fetched successfully.`,
      bookings: vendorUpcomingBookings,
    };
  }

  // This service GETS all vendor's assigned jobs
  async getVendorOngoingJobs(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Fetch all bookings with the _id provided
    const vendorOngoingBookings = await BookingModel.find({
      vendorJobWasSentTo: _id,
      hasVendorAccepted: true,
      hasVendorDeclined: false,
      bookingStatus: "Ongoing",
    })
      .populate("booking")
      .sort({ createdAt: -1 });

    return {
      status: 200,
      message: `All vendor's upcoming bookings have been fetched successfully.`,
      bookings: vendorOngoingBookings,
    };
  }

  // This service GETS the vendor's bookings the vendor id
  async getVendorBookingsByVendorId(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Fetch all bookings with the _id provided
    const bookings = await BookingModel.find({ vendor: _id });

    return {
      status: 200,
      message: `All vendor's bookings have been fetched successfully.`,
      bookings: bookings,
    };
  }

  async acceptJob(vendorId, bookingId, fleetId, driverId) {
    console.log("BOOKIGNS ASSIGNED TO 1:");
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([
      vendorId,
      bookingId,
      fleetId,
      driverId,
    ]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any vendor exists with the _id
    const vendor = await this.VendorModel.findOne({ _id: vendorId }).populate(
      "bookingsAssignedTo"
    );
    if (!vendor) {
      return {
        status: 404,
        message: `No vendor with _id ${vendorId} exists.`,
      };
    }

    console.log("BOOKIGNS ASSIGNED TO 2:");

    // Check if any booking exists with the _id
    const bookingExists = await BookingModel.findOne({
      _id: bookingId,
    })
      .populate("booking")
      .populate("assignedCar")
      .populate("vendorAssignedDriver");
    if (!bookingExists) {
      return {
        status: 404,
        message: `No booking with _id ${bookingId} exists.`,
      };
    }

    console.log("BOOKIGNS ASSIGNED TO 3:");

    // Check if any vendor exists with the _id
    const vendorExists = await this.VendorModel.findOne({
      _id: vendorId,
    }).populate("bookingsAssignedTo");
    if (!vendorExists) {
      return {
        status: 404,
        message: `No vendor with _id ${vendorId} exists.`,
      };
    }

    console.log("BOOKIGNS ASSIGNED TO 4:");
    // Update booking to "ACCEPT" job
    const acceptBooking = await BookingModel.findOneAndUpdate(
      { _id: bookingId },
      {
        bookingStatus: "Scheduled",
        isAssignedToVendor: true,
        assignedVendor: vendorId,
        vendorAssignedDriver: driverId,
        assignedCar: fleetId,
        hasVendorAccepted: true,
      }
    )
      .populate("assignedVendor")
      .populate("vendorJobWasSentTo")
      .populate("user");

    console.log("BOOKIGNS ASSIGNED TO 5:", vendorExists);
    // Update vendor schema
    vendorExists?.bookingsAssignedTo?.push(bookingId);
    await vendorExists.save();

    console.log("BOOKIGNS ASSIGNED TO 6:");

    // Send a notification to the admin
    const updatedBooking = await BookingModel.findOne({
      _id: bookingId,
    })
      .populate("booking")
      .populate("assignedCar")
      .populate("vendorAssignedDriver");

    const adminEmailHTML = AdminAcceptedBookingEmailTemplate({
      isVendor: true,
      bookingReference: updatedBooking?.booking?.bookingReference,
      pickupDate: moment(updatedBooking?.booking?.pickupDate).format(
        "MMM DD, YYYY"
      ),
      pickupTime: moment(updatedBooking?.booking?.pickupTime).format("H:MM A"),
      pickupLocation: updatedBooking?.booking?.pickupAddress,
      driverName: `${updatedBooking?.vendorAssignedDriver?.firstName} ${updatedBooking?.vendorAssignedDriver?.lastName}`,
      driverMobile: updatedBooking?.vendorAssignedDriver?.mobile,
      vendorName: `${
        updatedBooking?.assignedVendor?.firstName ??
        updatedBooking?.vendorJobWasSentTo?.firstName
      } ${
        updatedBooking?.assignedVendor?.lastName ??
        updatedBooking?.vendorJobWasSentTo?.lastName
      }`,
      vendorMobile:
        updatedBooking?.assignedVendor?.mobile ??
        updatedBooking?.vendorJobWasSentTo?.mobile,
      passengerName: `${
        updatedBooking?.user?.firstName ?? updatedBooking?.firstName
      } ${updatedBooking?.user?.lastName ?? updatedBooking?.lastName}`,
      passengerMobile: updatedBooking?.user?.mobile ?? updatedBooking?.mobile,
    });

    const adminMessage = {
      //   to: "info@shuttlelane.com",
      to: "effiemmanuel.n@gmail.com",
      from: process.env.SENGRID_EMAIL,
      subject: `Booking Confirmation: ${updatedBooking?.bookingReference}`,
      html: ReactDOMServer.renderToString(adminEmailHTML),
    };
    sendEmail(adminMessage);

    console.log("BOOKIGNS ASSIGNED TO 7:");
    // Send a notification to the user
    const userEmailHTML = UserBookingScheduledConfirmation({
      bookingReference: updatedBooking?.booking?.bookingReference,
      pickupDate: moment(updatedBooking?.booking?.pickupDate).format(
        "MMM DD, YYYY"
      ),
      pickupTime: moment(updatedBooking?.booking?.pickupTime).format("H:MM A"),
      pickupLocation: updatedBooking?.booking?.pickupAddress,
      driverName: `${updatedBooking?.vendorAssignedDriver?.firstName} ${updatedBooking?.vendorAssignedDriver?.lastName}`,
      driverMobile: updatedBooking?.vendorAssignedDriver?.mobile,
      carName: updatedBooking?.assignedCar?.carName,
      carType: updatedBooking?.assignedCar?.carType,
      carModel: updatedBooking?.assignedCar?.carModel,
      carColor: updatedBooking?.assignedCar?.carColor,
      carPlateNumber: updatedBooking?.assignedCar?.carPlateNumber,
    });

    console.log("BOOKIGNS ASSIGNED TO 7.1:");

    const userMessage = {
      to: bookingExists?.user?.email ?? bookingExists?.email,
      from: process.env.SENGRID_EMAIL,
      subject: `Your booking has been scheduled: ${bookingExists?.bookingReference}`,
      html: ReactDOMServer.renderToString(userEmailHTML),
    };

    console.log("BOOKIGNS ASSIGNED TO 7.2:");
    sendEmail(userMessage);

    console.log("BOOKIGNS ASSIGNED TO 8:");
    // Send a notification to the vendor
    const vendorEmailHTML = VendorAcceptedBookingEmailTemplate({
      pickupDate: moment(bookingExists?.booking?.pickupDate).format(
        "MMM DD, YYYY"
      ),
      pickupTime: moment(bookingExists?.booking?.pickupTime).format("H:MM A"),
      pickupLocation: bookingExists?.booking?.pickupAddress,
      passengerName: `${
        bookingExists?.user?.firstName ?? bookingExists?.firstName
      } ${bookingExists?.user?.lastName ?? bookingExists?.lastName}`,
      passengerMobile: bookingExists?.user?.mobile ?? bookingExists?.mobile,
    });

    const vendorMessage = {
      to:
        bookingExists?.assignedVendor?.email ??
        bookingExists?.vendorJobWasSentTo?.email,
      from: process.env.SENGRID_EMAIL,
      subject: `Booking Confirmation: ${bookingExists?.bookingReference}`,
      html: ReactDOMServer.renderToString(vendorEmailHTML),
    };
    sendEmail(vendorMessage);

    console.log("BOOKIGNS ASSIGNED TO 9:");
    // Send a notification to the vendor if this is his first booking on shuttlelane
    if (vendorExists?.bookingsAssignedTo?.length === 1) {
      const vendorFirstTimeEmailHTML = VendorFirstTimeBookingEmailTemplate({
        vendorName: `${
          bookingExists?.assignedVendor?.firstName ??
          bookingExists?.vendorJobWasSentTo?.firstName
        } ${
          bookingExists?.assignedVendor?.lastName ??
          bookingExists?.vendorJobWasSentTo?.lastName
        }`,
      });

      const vendorFirstTimeMessage = {
        to: vendorExists?.email,
        from: process.env.SENGRID_EMAIL,
        subject: `Congratulations on accepting your first booking!🎉`,
        html: ReactDOMServer.renderToString(vendorFirstTimeEmailHTML),
      };
      sendEmail(vendorFirstTimeMessage);
    }

    // Fetch all upcoming bookings with the _id provided
    const vendorUpcomingBookings = await BookingModel.find({
      vendorJobWasSentTo: vendorId,
      hasVendorAccepted: true,
      hasVendorDeclined: false,
      bookingStatus: "Scheduled",
    }).populate("booking");

    // Fetch all bookings with the _id provided
    const vendorAssignedBookings = await BookingModel.find({
      vendorJobWasSentTo: vendorId,
      hasVendorAccepted: false,
      hasVendorDeclined: false,
    }).populate("booking");

    return {
      status: 201,
      assignedBookings: vendorAssignedBookings,
      upcomingBookings: vendorUpcomingBookings,
      message:
        "Booking has been accepted! Be sure to arrive on time and drive safely.",
    };
  }

  async declineJob(vendorId, bookingId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([vendorId, bookingId]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Check if any vendor exists with the _id
    const vendor = await this.VendorModel.findOne({ _id: vendorId });
    if (!vendor) {
      return {
        status: 404,
        message: `No vendor with _id ${vendorId} exists.`,
      };
    }

    // Check if any booking exists with the _id
    const bookingExists = await BookingModel.findOne({
      _id: bookingId,
    })
      .populate("booking")
      .populate("driverJobWasSentTo")
      .populate("vendorJobWasSentTo");
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
        isAssignedToVendor: false,
        hasVendorAccepted: false,
        hasVendorDeclined: true,
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
      isVendor: true,
      vendorName: bookingExists?.vendorJobWasSentTo?.companyName,
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
    const vendorUpcomingBookings = await BookingModel.find({
      vendorJobWasSentTo: vendorId,
      hasVendorAccepted: true,
      hasVendorDeclined: false,
      bookingStatus: "Scheduled",
    }).populate("booking");

    // Fetch all bookings with the _id provided
    const vendorAssignedBookings = await BookingModel.find({
      vendorJobWasSentTo: vendorId,
      hasVendorAccepted: false,
      hasVendorDeclined: false,
    }).populate("booking");

    return {
      status: 201,
      assignedBookings: vendorAssignedBookings,
      upcomingBookings: vendorUpcomingBookings,
      message: "Booking has been successfully rejected.",
    };
  }

  // This service GETS a vendor's earnings
  async getVendorEarnings(_id) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([_id]);

    // areFieldsEmpty is an object that contains a status and message field
    if (areFieldsEmpty) return areFieldsEmpty;

    // Fetch all ONGOING bookings with the _id provided
    const vendorOngoingBookings = await BookingModel.find({
      vendorJobWasSentTo: _id,
      hasVendorAccepted: true,
      hasVendorDeclined: false,
      bookingStatus: "Ongoing",
    });

    // Fetch all SCHEDULED bookings with the _id provided
    const vendorScheduledBookings = await BookingModel.find({
      vendorJobWasSentTo: _id,
      hasVendorAccepted: true,
      hasVendorDeclined: false,
      bookingStatus: "Scheduled",
    });

    // Fetch all COMPLETED bookings with the _id provided
    const vendorCompletedBookings = await BookingModel.find({
      vendorJobWasSentTo: _id,
      hasVendorAccepted: true,
      hasVendorDeclined: false,
      bookingStatus: "Completed",
    });

    // Calculate Ongoing + Scheduled as the "Expected earnings"
    let expectedEarnings = 0;
    vendorOngoingBookings?.forEach((booking) => {
      expectedEarnings = +booking?.bookingRate + +expectedEarnings;
    });
    vendorScheduledBookings?.forEach((booking) => {
      expectedEarnings = +booking?.bookingRate + +expectedEarnings;
    });

    // Calculate Completed as "Earned"
    let earnings = 0;
    vendorCompletedBookings?.forEach((booking) => {
      earnings = +booking?.bookingRate + +earnings;
    });

    return {
      status: 200,
      message: `All vendor's earnings have been fetched successfully.`,
      expectedEarnings,
      earnings,
    };
  }

  async startBooking(vendorId, bookingId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([vendorId, bookingId]);

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

    // Check if any vendor exists with the _id
    const vendorExists = await this.VendorModel.findOne({
      _id: vendorId,
    }).populate("bookingsAssignedTo");
    if (!vendorExists) {
      return {
        status: 404,
        message: `No vendor with _id ${vendorId} exists.`,
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
      .populate("assignedVendor")
      .populate("vendorJobWasSentTo")
      .populate("user");

    console.log("BOOKIGNS ASSIGNED TO 6:");

    // Send a notification to the admin
    const adminEmailHTML = AdminVendorEnRouteEmailTemplate({
      bookingReference: bookingExists?.booking?.bookingReference,
      vendorName: `${
        bookingExists?.assignedVendor?.firstName ??
        bookingExists?.vendorJobWasSentTo?.firstName
      } ${
        bookingExists?.assignedVendor?.lastName ??
        bookingExists?.vendorJobWasSentTo?.lastName
      }`,
      vendorContact:
        bookingExists?.assignedVendor?.mobile ??
        bookingExists?.vendorJobWasSentTo?.mobile,
    });

    const adminMessage = {
      //   to: 'info@shuttlelane.com',
      to: "effiemmanuel.n@gmail.com",
      from: process.env.SENGRID_EMAIL,
      subject: `Vendor En Route: ${bookingExists?.bookingReference}`,
      html: ReactDOMServer.renderToString(adminEmailHTML),
    };
    sendEmail(adminMessage);

    // Send a notification to the user
    const userEmailHTML = UserVendorStartedBookingEmailTemplate({
      bookingReference: bookingExists?.booking?.bookingReference,
      firstName: `${
        bookingExists?.user?.firstName ?? bookingExists?.firstName
      }`,
      vendorName: `${
        bookingExists?.assignedVendor?.firstName ??
        bookingExists?.vendorJobWasSentTo?.firstName
      } ${
        bookingExists?.assignedVendor?.lastName ??
        bookingExists?.vendorJobWasSentTo?.lastName
      }`,
      vendorContact:
        bookingExists?.assignedVendor?.mobile ??
        bookingExists?.vendorJobWasSentTo?.mobile,
    });

    const userMessage = {
      to: bookingExists?.user?.email ?? bookingExists?.email,
      from: process.env.SENGRID_EMAIL,
      subject: `Your trip has started: ${bookingExists?.bookingReference}`,
      html: ReactDOMServer.renderToString(userEmailHTML),
    };

    sendEmail(userMessage);

    // Fetch all upcoming bookings with the _id provided
    const vendorUpcomingBookings = await BookingModel.find({
      vendorJobWasSentTo: vendorId,
      hasVendorAccepted: true,
      hasVendorDeclined: false,
      bookingStatus: "Scheduled",
    })
      .populate("booking")
      .sort({ createdAt: -1 });

    // Fetch all bookings with the _id provided
    const vendorAssignedBookings = await BookingModel.find({
      vendorJobWasSentTo: vendorId,
      hasVendorAccepted: false,
      hasVendorDeclined: false,
    })
      .populate("booking")
      .sort({ createdAt: -1 });

    // Fetch all bookings with the _id provided
    const vendorOngoingBookings = await BookingModel.find({
      vendorJobWasSentTo: vendorId,
      bookingStatus: "Ongoing",
    })
      .populate("booking")
      .sort({ createdAt: -1 });

    return {
      status: 201,
      assignedBookings: vendorAssignedBookings,
      upcomingBookings: vendorUpcomingBookings,
      ongoingBookings: vendorOngoingBookings,
      message:
        "Booking has started! Be sure to arrive on time and drive safely.",
    };
  }

  async endBooking(vendorId, bookingId) {
    // Validate if fields are empty
    const areFieldsEmpty = validateFields([vendorId, bookingId]);

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

    // Check if any vendor exists with the _id
    const vendorExists = await this.VendorModel.findOne({
      _id: vendorId,
    }).populate("bookingsAssignedTo");
    if (!vendorExists) {
      return {
        status: 404,
        message: `No vendor with _id ${vendorId} exists.`,
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
      .populate("assignedVendor")
      .populate("vendorJobWasSentTo")
      .populate("user");

    console.log("BOOKIGNS ASSIGNED TO 6:");

    // Send a notification to the admin
    const adminEmailHTML = AdminBookingEndedEmailTemplate({
      bookingReference: bookingExists?.booking?.bookingReference,
    });

    const adminMessage = {
      //   to: 'info@shuttlelane.com',
      to: "effiemmanuel.n@gmail.com",
      from: process.env.SENGRID_EMAIL,
      subject: `Trip Ended: ${bookingExists?.bookingReference}`,
      html: ReactDOMServer.renderToString(adminEmailHTML),
    };
    sendEmail(adminMessage);

    // Send a notification to the user
    const userEmailHTML = UserBookingCompletedEmailTemplate({
      bookingReference: bookingExists?.booking?.bookingReference,
      firstName: `${
        bookingExists?.user?.firstName ?? bookingExists?.firstName
      }`,
    });

    const userMessage = {
      to: bookingExists?.user?.email ?? bookingExists?.email,
      from: process.env.SENGRID_EMAIL,
      subject: `Trip Ended: ${bookingExists?.bookingReference}`,
      html: ReactDOMServer.renderToString(userEmailHTML),
    };

    sendEmail(userMessage);

    // Fetch all upcoming bookings with the _id provided
    const vendorUpcomingBookings = await BookingModel.find({
      vendorJobWasSentTo: vendorId,
      hasVendorAccepted: true,
      hasVendorDeclined: false,
      bookingStatus: "Scheduled",
    }).populate("booking");

    // Fetch all bookings with the _id provided
    const vendorAssignedBookings = await BookingModel.find({
      vendorJobWasSentTo: vendorId,
      hasVendorAccepted: false,
      hasVendorDeclined: false,
    }).populate("booking");

    // Fetch all bookings with the _id provided
    const vendorOngoingBookings = await BookingModel.find({
      vendorJobWasSentTo: vendorId,
      bookingStatus: "Ongoing",
    }).populate("booking");

    // Fetch all bookings with the _id provided
    const vendorCompletedBookings = await BookingModel.find({
      vendorJobWasSentTo: vendorId,
      bookingStatus: "Completed",
    }).populate("booking");

    return {
      status: 201,
      assignedBookings: vendorAssignedBookings,
      upcomingBookings: vendorUpcomingBookings,
      ongoingBookings: vendorOngoingBookings,
      completedBookings: vendorCompletedBookings,
      message: "Booking ended successfully",
    };
  }

  // This service CREATES a new vendor driver
  async signupVendorDriver(vendorDriver) {
    console.log("VENDOR:", vendorDriver);
    // Check if vendorDriver is already signed up
    const vendorDriverAlreadyExistsWithEmail =
      await checkVendorDriverEmailValidity(vendorDriver.email);

    // If vendorDriver email already exists
    if (vendorDriverAlreadyExistsWithEmail.status === 409)
      return vendorDriverAlreadyExistsWithEmail;

    // If the email is available, then proceed to sign up the vendor
    const newVendorDriver = await VendorDriverModel.create({
      ...vendorDriver,
    });

    // TO-DO: Send confirmation email here
    const emailHTML = DriverSignupConfirmationEmail({
      driver: newVendorDriver,
    });

    const message = {
      to: newVendorDriver?.email,
      from: process.env.SENGRID_EMAIL,
      subject: "Driver Account Created Successfully🎉",
      html: ReactDOMServer.renderToString(emailHTML),
    };
    await sendEmail(message);

    // Update Vendor document to include the verification
    const vendor = await this.VendorModel.findOne({
      _id: vendorDriver?.vendor,
    });
    const vendorDrivers = vendor?.drivers;
    const updateVendor = await this.VendorModel.findOneAndUpdate(
      { _id: vendor?._id },
      {
        drivers: vendorDrivers?.push(newVendorDriver?._id),
      }
    );

    // Get Updated Vendor drivers
    const updatedVendorAccount = await this.VendorModel.findOne({
      _id: vendorDriver?.vendor,
    }).populate("drivers");
    const updatedVendorDrivers = updatedVendorAccount?.drivers;

    return {
      status: 201,
      message: "Driver account has been created successfully!",
      vendorDriver: newVendorDriver,
      vendorDrivers: updatedVendorDrivers,
    };
  }

  // This service CREATES a new vendor fleet
  async createFleet(fleet) {
    // If the email is available, then proceed to sign up the vendor
    const newFleet = await VendorDriverModel.create({
      ...fleet,
    });

    // Update Vendor fleet to include the new car
    const vendor = await this.VendorModel.findOne({
      _id: vendorDriver?.vendor,
    });
    const vendorFleet = vendor?.fleet;

    const updateVendor = await this.VendorModel.findOneAndUpdate(
      { _id: newVendor?._id },
      {
        fleet: vendorFleet?.push(newFleet?._id),
      }
    );

    // Get Updated Vendor fleet
    const updatedVendorAccount = await this.VendorModel.findOne({
      _id: vendorDriver?.vendor,
    });
    const updatedVendorFleet = updatedVendorAccount?.fleet;

    return {
      status: 201,
      message: `${newFleet?.carName} has been added to your fleet`,
      newFleet: newFleet,
      vendorFleet: updatedVendorFleet,
    };
  }

  // This service GETS all vendor drivers
  async getVendorDrivers() {
    // Fetch all vendor drivers
    const vendorDrivers = await VendorDriverModel.find().sort({
      createdAt: -1,
    });

    return {
      status: 200,
      message: `All vendor drivers have been fetched successfully.`,
      vendorDrivers: vendorDrivers,
    };
  }

  // This service GETS all vendor drivers
  async getVendorFleet() {
    // Fetch all vendor fleet
    const vendorFleet = await VendorFleetModel.find().sort({ createdAt: -1 });

    return {
      status: 200,
      message: `All vendor fleet have been fetched successfully.`,
      vendorFleet: vendorFleet,
    };
  }
}
