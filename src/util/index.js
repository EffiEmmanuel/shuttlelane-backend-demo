import ShortUniqueId from "short-unique-id";

export function generateBookingReference(bookingType) {
  const AIRPORT_TRANSFER_BASE_REF = "AT";
  const CAR_RENTAL_BASE_REF = "CR";
  const PRIORITY_PASS_BASE_REF = "PP";
  const VISA_ON_ARRIVAL_BASE_REF = "VOA";

  let uid = new ShortUniqueId({ length: 5 });
  uid.setDictionary("alphanum_upper");
  let reference = uid.rnd();

  switch (bookingType) {
    case "Airport Transfer":
      reference = `${AIRPORT_TRANSFER_BASE_REF}-${reference}`;
      break;
    case "Car Rental":
      reference = `${CAR_RENTAL_BASE_REF}-${reference}`;
      break;
    case "Priority Pass":
      reference = `${PRIORITY_PASS_BASE_REF}-${reference}`;
      break;
    case "Visa On Arrival":
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
