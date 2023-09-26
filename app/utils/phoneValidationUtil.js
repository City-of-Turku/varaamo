import { PhoneNumberUtil } from 'google-libphonenumber';

export function isValidPhoneNumber(number) {
  // only allow numbers and + if its the first char
  const regex = /^([+]\d*|\d*)$/;
  if (regex.test(number) === false) {
    return false;
  }

  const phoneUtil = PhoneNumberUtil.getInstance();
  // if number starts with +, try to parse with any country code
  if (number && number[0] === '+') {
    try {
      const parsedNumber = phoneUtil.parse(number, '');
      return phoneUtil.isValidNumber(parsedNumber);
    } catch (error) {
      return false;
    }
  } else {
    // if number doesnt start with +, assume country code is FI
    try {
      const parsedNumber = phoneUtil.parseAndKeepRawInput(number, 'FI');
      return phoneUtil.isValidNumber(parsedNumber);
    } catch (error) {
      return false;
    }
  }
}
