import axios from "axios";
import ShortUniqueId from "short-unique-id";
import RatePerMileModel from "../model/ratePerMile.model.js";
import AirportTransferBookingModel from "../model/airportTransferBooking.model.js";
import moment from "moment";
import CarRentalBookingModel from "../model/carRentalBooking.model.js";
import PriorityPassBookingModel from "../model/priorityPassBooking.model.js";
import VisaOnArrivalBookingModel from "../model/visaOnArrivalBooking.model.js";

export function generateBookingReference(bookingType) {
  const AIRPORT_TRANSFER_BASE_REF = "AT";
  const CAR_RENTAL_BASE_REF = "CR";
  const PRIORITY_PASS_BASE_REF = "PP";
  const VISA_ON_ARRIVAL_BASE_REF = "VOA";

  let uid = new ShortUniqueId({ length: 5 });
  uid.setDictionary("alphanum_upper");
  let reference = uid.rnd();

  switch (bookingType) {
    case "Airport":
      reference = `${AIRPORT_TRANSFER_BASE_REF}-${reference}`;
      break;
    case "Car":
      reference = `${CAR_RENTAL_BASE_REF}-${reference}`;
      break;
    case "Priority":
      reference = `${PRIORITY_PASS_BASE_REF}-${reference}`;
      break;
    case "Visa":
      reference = `${VISA_ON_ARRIVAL_BASE_REF}-${reference}`;
      break;
    default:
      break;
  }

  if (reference.length > 5) {
    return reference;
  } else {
    return null;
  }
}

export function generateSlug(str) {
  return str
    .toLowerCase() // Convert the string to lowercase
    .replace(/[^\w\s-]/g, "") // Remove non-word characters except spaces and hyphens
    .trim() // Trim leading/trailing spaces
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple consecutive hyphens with a single hyphen
}

// TO-DO: Implement auto exchange rate here
export async function convertAmountToUserCurrency(currency, amountInNaira) {
  // Make API call to get the current exchange rate conversion of the amount in the user's currency
  const convertedAmount = await axios
    .get(
      `https://api.exchangeratesapi.io/v1/convert?access_key=${process.env.EXCHANGE_RATE_API_KEY}&from=NGN&to=${currency?.alias}&amount=${amountInNaira}`
    )
    .then((res) => {
      let total;

      // Get the current exchange rate
      const fetchedExchangeRateConversion = res.data?.result;

      console.log("FETCHED EXCHANGE RATE:", fetchedExchangeRateConversion);

      // Add the percentage the admin has set for this currency to the exchange rate
      // Then calculate the total using this exchangeRate
      const percentageAmount =
        (Number(currency?.exchangeRatePercentage) / 100) *
        Number(fetchedExchangeRateConversion);

      console.log("PERCENTAGE AMOUNT:", percentageAmount);

      // Add the percentage amount and the additional rate to the fetched exchange rate conversion
      total =
        Number(fetchedExchangeRateConversion) +
        Number(percentageAmount) +
        Number(currency?.additionalRate);

      let exchangeAmountToFixed = total.toFixed(2);

      console.log("TOTAL EXCHANGE RATE CONVERSION:", exchangeAmountToFixed);

      return exchangeAmountToFixed;
    })
    .catch((error) => {
      console.log("ERROR FROM EXCHANGE RATE CONVERSION:", error);
      return 0;
    });

  return convertedAmount;
}

export async function calculateDistanceAndDuration(
  pickupAddress,
  dropoffAddress,
  currency,
  city
) {
  try {
    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${pickupAddress}&destinations=${dropoffAddress}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    // Fetch distance and trip duration
    const response = await axios.get(apiUrl);

    const distance = response.data.rows[0].elements[0].distance?.text;
    const duration = response.data.rows[0].elements[0].duration?.text;

    // Fetch price per mile (Admin function)
    const ratePerMile = await RatePerMileModel.findOne({ city: city });

    // Subtract distance from from the minimum mile set by the admin
    console.log("HEY HEY :", distance?.split(" ")[0]);
    const eligibleDistanceForBilling =
      Number(distance?.split(" ")[0].replace(/,/g, "")) -
      Number(ratePerMile?.mile);
    console.log("ELIGIBLE DISTANCE FOR BILLING:", eligibleDistanceForBilling);

    // Calculate bill for eligible distance (by default, in naira)
    let billedDistanceTotal = 0;
    if (eligibleDistanceForBilling > 0) {
      billedDistanceTotal =
        Number(ratePerMile?.rate) * eligibleDistanceForBilling;

      console.log("BILL AMOUNT:", billedDistanceTotal);
      // Convert to user's currency
      if (currency) {
        const convertedAmount = await convertAmountToUserCurrency(
          currency,
          billedDistanceTotal
        );
        console.log("CONVERTED AMOUNT:", convertedAmount);
        billedDistanceTotal = convertedAmount;
      }
    }

    console.log("BILLED DISTANCE TOTAL:", billedDistanceTotal);

    return {
      distance,
      duration,
      billedDistanceTotal,
    };
  } catch (error) {
    console.log("ERROR:", error);
  }
}

// This function returns booking details (for email) based on the booking type FOR DRIVERS AND VENDORS
export async function generateBookingDetails(bookingExists) {
  let bookingDetails, booking;
  if (bookingExists?.bookingType == "Airport") {
    booking = await AirportTransferBookingModel.findOne({
      _id: bookingExists?.booking?._id,
    }).populate("vehicleClass");

    bookingDetails = [
      {
        label: "Pick-up Address",
        value: bookingExists?.booking?.pickupAddress,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Pick-up Date",
        value: moment(bookingExists?.booking?.pickupDate).format(
          "MMM DD, YYYY"
        ),
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Pick-up Time",
        value: moment(bookingExists?.booking?.pickupTime).format("HH:MM A"),
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Drop-off Address",
        value: bookingExists?.booking?.dropoffAddress,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Passenger",
        value: `${bookingExists?.user?.title ?? bookingExists?.title} ${
          bookingExists?.user?.firstName ?? bookingExists?.firstName
        } ${bookingExists?.user?.lastName ?? bookingExists?.lastName}`,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "RATE",
        value: `₦${bookingExists?.bookingRate}`,
        backgroundColor: "#F5F5F5",
      },
    ];
  } else if (bookingExists?.bookingType == "Car") {
    booking = await CarRentalBookingModel.findOne({
      _id: bookingExists?.booking?._id,
    }).populate("car");

    bookingDetails = [
      {
        label: "Pick-up Address",
        value: bookingExists?.booking?.pickupAddress,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Pick-up Date",
        value: moment(bookingExists?.booking?.pickupDate).format(
          "MMM DD, YYYY"
        ),
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Pick-up Time",
        value: moment(bookingExists?.booking?.pickupTime).format("HH:MM A"),
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Car",
        value: booking?.car?.name,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Passenger",
        value: `${bookingExists?.user?.title ?? bookingExists?.title} ${
          bookingExists?.user?.firstName ?? bookingExists?.firstName
        } ${bookingExists?.user?.lastName ?? bookingExists?.lastName}`,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "RATE",
        value: `₦${bookingExists?.bookingRate}`,
        backgroundColor: "#F5F5F5",
      },
    ];
  } else if (bookingExists?.bookingType == "Priority") {
    booking = await PriorityPassBookingModel.findOne({
      _id: bookingExists?.booking?._id,
    }).populate("pass");

    bookingDetails = [
      {
        label: "Pick-up Address",
        value: bookingExists?.booking?.pickupAddress,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Pick-up Date",
        value: moment(bookingExists?.booking?.pickupDate).format(
          "MMM DD, YYYY"
        ),
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Pick-up Time",
        value: moment(bookingExists?.booking?.pickupTime).format("HH:MM A"),
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Airline",
        value: bookingExists?.booking?.airline ?? "N/A",
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Flight Number",
        value: bookingExists?.booking?.flightNumber ?? "N/A",
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Service Type",
        value: booking?.service,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Protocol Type",
        value: booking?.pass?.name,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Passenger",
        value: `${bookingExists?.user?.title ?? bookingExists?.title} ${
          bookingExists?.user?.firstName ?? bookingExists?.firstName
        } ${bookingExists?.user?.lastName ?? bookingExists?.lastName}`,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "RATE",
        value: `₦${bookingExists?.bookingRate}`,
        backgroundColor: "#FFFFFF",
      },
    ];
  } else if (bookingExists?.bookingType == "Visa") {
    booking = await VisaOnArrivalBookingModel.findOne({
      _id: bookingExists?.booking?._id,
    }).populate("pass");

    bookingDetails = [
      {
        label: "Nationality",
        value: bookingExists?.booking?.nationality,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Visa Class",
        value: bookingExists?.booking?.visaClass,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Passport Type",
        value: bookingExists?.booking?.passportType,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Full Name",
        value: `${bookingExists?.booking?.title} ${bookingExists?.booking?.surname} ${bookingExists?.booking?.firstName} ${bookingExists?.booking?.middleName}`,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Email",
        value: bookingExists?.booking?.email,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Date Of Birth",
        value: moment(bookingExists?.booking?.dateOfBirth).format(
          "MMM DD, YYYY"
        ),
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Place Of Birth",
        value: bookingExists?.booking?.placeOfBirth,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Gender",
        value: bookingExists?.booking?.gender,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Marital Status",
        value: bookingExists?.booking?.maritalStatus,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Passport Number",
        value: bookingExists?.booking?.passportNumber,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Passport Expiry Date",
        value: moment(bookingExists?.booking?.passportExpiryDate).format(
          "MMM DD, YYYY"
        ),
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Purpose Of Journey",
        value: bookingExists?.booking?.purposeOfJourney,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Airline",
        value: bookingExists?.booking?.airline,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Flight Number",
        value: bookingExists?.booking?.flightNumber,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Country Of Departure",
        value: bookingExists?.booking?.countryOfDeparture,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Arrival Date",
        value: moment(bookingExists?.booking?.arrivalDate).format(
          "MMM DD, YYYY"
        ),
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Port Of Entry",
        value: bookingExists?.booking?.portOfEntry,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Duration Of Stay",
        value: bookingExists?.booking?.durationOfStay,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Contact Name",
        value: bookingExists?.booking?.contactName,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Contact Number",
        value: bookingExists?.booking?.contactNumber,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Contact Address",
        value: bookingExists?.booking?.contactAddress,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Contact City",
        value: bookingExists?.booking?.contactCity,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Contact State",
        value: bookingExists?.booking?.contactState,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Contact Email",
        value: bookingExists?.booking?.contactEmail,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Contact Postal Code",
        value: bookingExists?.booking?.contactPostalCode,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "RATE",
        value: `₦${bookingExists?.bookingRate}`,
        backgroundColor: "#FFFFFF",
      },
    ];
  }

  return bookingDetails;
}

// This function returns booking details (for email) based on the booking type FOR USERS
export async function generateUserBookingDetails(bookingExists) {
  let bookingDetails, booking;
  if (bookingExists?.bookingType == "Airport") {
    booking = await AirportTransferBookingModel.findOne({
      _id: bookingExists?.booking?._id,
    }).populate("vehicleClass");

    bookingDetails = [
      {
        label: "Pick-up Address",
        value: bookingExists?.booking?.pickupAddress,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Pick-up Date",
        value: moment(bookingExists?.booking?.pickupDate).format(
          "MMM DD, YYYY"
        ),
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Pick-up Time",
        value: moment(bookingExists?.booking?.pickupTime).format("HH:MM A"),
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Drop-off Address",
        value: bookingExists?.booking?.dropoffAddress,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Passenger",
        value: `${bookingExists?.user?.title ?? bookingExists?.title} ${
          bookingExists?.user?.firstName ?? bookingExists?.firstName
        } ${bookingExists?.user?.lastName ?? bookingExists?.lastName}`,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Driver's Name",
        value: bookingExists?.isAssignedToDriver
          ? `${
              bookingExists?.assignedDriver?.firstName ??
              bookingExists?.driverJobWasSentTo?.firstName
            } ${
              bookingExists?.assignedDriver?.lastName ??
              bookingExists?.driverJobWasSentTo?.lastName
            }`
          : `${bookingExists?.vendorAssignedDriver?.firstName} ${bookingExists?.vendorAssignedDriver?.lastName}`,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Driver's Phone Number",
        value: bookingExists?.isAssignedToDriver
          ? `${
              bookingExists?.assignedDriver?.mobile ??
              bookingExists?.driverJobWasSentTo?.mobile
            }`
          : `${bookingExists?.vendorAssignedDriver?.mobile}`,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Car Name",
        value: bookingExists?.isAssignedToDriver
          ? `${
              bookingExists?.assignedDriver?.carYear ??
              bookingExists?.driverJobWasSentTo?.carYear
            } ${
              bookingExists?.assignedDriver?.carName ??
              bookingExists?.driverJobWasSentTo?.carName
            } ${
              bookingExists?.assignedDriver?.carModel ??
              bookingExists?.driverJobWasSentTo?.carModel
            }`
          : `${bookingExists?.assignedCar?.carYear} ${bookingExists?.assignedCar?.carName} ${bookingExists?.assignedCar?.carModel}`,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Car Color",
        value: bookingExists?.isAssignedToDriver
          ? `${
              bookingExists?.assignedDriver?.carColor ??
              bookingExists?.driverJobWasSentTo?.carColor
            }`
          : `${bookingExists?.assignedCar?.carColor}`,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Car Plate Number",
        value: bookingExists?.isAssignedToDriver
          ? `${
              bookingExists?.assignedDriver?.carPlateNumber ??
              bookingExists?.driverJobWasSentTo?.carPlateNumber
            }`
          : `${bookingExists?.assignedCar?.carPlateNumber}`,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "TOTAL BILLED",
        value: `${bookingExists?.bookingCurrency?.symbol}${bookingExists?.bookingTotal}`,
        backgroundColor: "#FFFFFF",
      },
    ];
  } else if (bookingExists?.bookingType == "Car") {
    booking = await CarRentalBookingModel.findOne({
      _id: bookingExists?.booking?._id,
    }).populate("car");

    bookingDetails = [
      {
        label: "Pick-up Address",
        value: bookingExists?.booking?.pickupAddress,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Pick-up Date",
        value: moment(bookingExists?.booking?.pickupDate).format(
          "MMM DD, YYYY"
        ),
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Pick-up Time",
        value: moment(bookingExists?.booking?.pickupTime).format("HH:MM A"),
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Car",
        value: booking?.car?.name,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Passenger",
        value: `${bookingExists?.user?.title ?? bookingExists?.title} ${
          bookingExists?.user?.firstName ?? bookingExists?.firstName
        } ${bookingExists?.user?.lastName ?? bookingExists?.lastName}`,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "TOTAL BILLED",
        value: `${bookingExists?.bookingCurrency?.symbol}${bookingExists?.bookingTotal}`,
        backgroundColor: "#FFFFFF",
      },
    ];
  } else if (bookingExists?.bookingType == "Priority") {
    booking = await PriorityPassBookingModel.findOne({
      _id: bookingExists?.booking?._id,
    }).populate("pass");

    bookingDetails = [
      {
        label: "Pick-up Address",
        value: bookingExists?.booking?.pickupAddress,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Pick-up Date",
        value: moment(bookingExists?.booking?.pickupDate).format(
          "MMM DD, YYYY"
        ),
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Pick-up Time",
        value: moment(bookingExists?.booking?.pickupTime).format("HH:MM A"),
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Airline",
        value: bookingExists?.booking?.airline ?? "N/A",
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Flight Number",
        value: bookingExists?.booking?.flightNumber ?? "N/A",
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Service Type",
        value: booking?.service,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Protocol Type",
        value: booking?.pass?.name,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Passenger",
        value: `${bookingExists?.user?.title ?? bookingExists?.title} ${
          bookingExists?.user?.firstName ?? bookingExists?.firstName
        } ${bookingExists?.user?.lastName ?? bookingExists?.lastName}`,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Driver's Name",
        value: bookingExists?.isAssignedToDriver
          ? `${
              bookingExists?.assignedDriver?.firstName ??
              bookingExists?.driverJobWasSentTo?.firstName
            } ${
              bookingExists?.assignedDriver?.lastName ??
              bookingExists?.driverJobWasSentTo?.lastName
            }`
          : `${bookingExists?.vendorAssignedDriver?.firstName} ${bookingExists?.vendorAssignedDriver?.lastName}`,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Driver's Phone Number",
        value: bookingExists?.isAssignedToDriver
          ? `${
              bookingExists?.assignedDriver?.mobile ??
              bookingExists?.driverJobWasSentTo?.mobile
            }`
          : `${bookingExists?.vendorAssignedDriver?.mobile}`,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Car Name",
        value: bookingExists?.isAssignedToDriver
          ? `${
              bookingExists?.assignedDriver?.carYear ??
              bookingExists?.driverJobWasSentTo?.carYear
            } ${
              bookingExists?.assignedDriver?.carName ??
              bookingExists?.driverJobWasSentTo?.carName
            } ${
              bookingExists?.assignedDriver?.carModel ??
              bookingExists?.driverJobWasSentTo?.carModel
            }`
          : `${bookingExists?.assignedCar?.carYear} ${bookingExists?.assignedCar?.carName} ${bookingExists?.assignedCar?.carModel}`,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Car Color",
        value: bookingExists?.isAssignedToDriver
          ? `${
              bookingExists?.assignedDriver?.carColor ??
              bookingExists?.driverJobWasSentTo?.carColor
            }`
          : `${bookingExists?.assignedCar?.carColor}`,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Car Plate Number",
        value: bookingExists?.isAssignedToDriver
          ? `${
              bookingExists?.assignedDriver?.carPlateNumber ??
              bookingExists?.driverJobWasSentTo?.carPlateNumber
            }`
          : `${bookingExists?.assignedCar?.carPlateNumber}`,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "TOTAL BILLED",
        value: `${bookingExists?.bookingCurrency?.symbol}${bookingExists?.bookingTotal}`,
        backgroundColor: "#F5F5F5",
      },
    ];
  } else if (bookingExists?.bookingType == "Visa") {
    booking = await VisaOnArrivalBookingModel.findOne({
      _id: bookingExists?.booking?._id,
    }).populate("pass");

    bookingDetails = [
      {
        label: "Nationality",
        value: bookingExists?.booking?.nationality,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Visa Class",
        value: bookingExists?.booking?.visaClass,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Passport Type",
        value: bookingExists?.booking?.passportType,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Full Name",
        value: `${bookingExists?.booking?.title} ${bookingExists?.booking?.surname} ${bookingExists?.booking?.firstName} ${bookingExists?.booking?.middleName}`,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Email",
        value: bookingExists?.booking?.email,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Date Of Birth",
        value: moment(bookingExists?.booking?.dateOfBirth).format(
          "MMM DD, YYYY"
        ),
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Place Of Birth",
        value: bookingExists?.booking?.placeOfBirth,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Gender",
        value: bookingExists?.booking?.gender,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Marital Status",
        value: bookingExists?.booking?.maritalStatus,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Passport Number",
        value: bookingExists?.booking?.passportNumber,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Passport Expiry Date",
        value: moment(bookingExists?.booking?.passportExpiryDate).format(
          "MMM DD, YYYY"
        ),
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Purpose Of Journey",
        value: bookingExists?.booking?.purposeOfJourney,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Airline",
        value: bookingExists?.booking?.airline,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Flight Number",
        value: bookingExists?.booking?.flightNumber,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Country Of Departure",
        value: bookingExists?.booking?.countryOfDeparture,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Arrival Date",
        value: moment(bookingExists?.booking?.arrivalDate).format(
          "MMM DD, YYYY"
        ),
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Port Of Entry",
        value: bookingExists?.booking?.portOfEntry,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Duration Of Stay",
        value: bookingExists?.booking?.durationOfStay,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Contact Name",
        value: bookingExists?.booking?.contactName,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Contact Number",
        value: bookingExists?.booking?.contactNumber,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Contact Address",
        value: bookingExists?.booking?.contactAddress,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Contact City",
        value: bookingExists?.booking?.contactCity,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Contact State",
        value: bookingExists?.booking?.contactState,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "Contact Email",
        value: bookingExists?.booking?.contactEmail,
        backgroundColor: "#F5F5F5",
      },
      {
        label: "Contact Postal Code",
        value: bookingExists?.booking?.contactPostalCode,
        backgroundColor: "#FFFFFF",
      },
      {
        label: "TOTAL BILLED",
        value: `${bookingExists?.bookingCurrency?.symbol}${bookingExists?.bookingTotal}`,
        backgroundColor: "#F5F5F5",
      },
    ];
  }

  console.log("USER BOOKING DETAILS:::", bookingDetails);

  return bookingDetails;
}
