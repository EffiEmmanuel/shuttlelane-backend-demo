import axios from "axios";
import ShortUniqueId from "short-unique-id";
import RatePerMileModel from "../model/ratePerMile.model.js";

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
export function convertAmountToUserCurrency(currency, amountInNaira) {
  const exchangeAmount = Number(amountInNaira) / Number(currency?.exchangeRate);
  let exchangeAmountToFixed = exchangeAmount.toFixed(2);
  return exchangeAmountToFixed;
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
        const convertedAmount = convertAmountToUserCurrency(
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
