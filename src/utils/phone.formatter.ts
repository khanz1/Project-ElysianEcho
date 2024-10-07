import { parsePhoneNumberFromString } from "libphonenumber-js";

export function formatPhoneNumber(phoneNumber: string) {
  const parsedNumber = parsePhoneNumberFromString(phoneNumber);

  if (parsedNumber) {
    return {
      international: parsedNumber.formatInternational(),
      national: parsedNumber.formatNational(),
      country: parsedNumber.country,
    };
  } else {
    throw new Error("Invalid phone number");
  }
}
