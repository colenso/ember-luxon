import { tracked } from '@glimmer/tracking';
import { isBlank } from '@ember/utils';
import { DateTime } from 'luxon';
import { g, i } from 'decorator-transforms/runtime';

function hasTimeZoneOffset(dateTimeString) {
  // Regex to match ISO strings with a timezone offset (Z or +/-HH:MM)
  const regex = /Z|([+-]\d{2}:\d{2})$/;
  return regex.test(dateTimeString);
}
function parseDateTime(dateTime, fromFormat = null) {
  if (isBlank(dateTime)) return DateTime.local();
  if (fromFormat) {
    let parsedDateTime = DateTime.fromFormat(dateTime, fromFormat);
    if (parsedDateTime.isValid) {
      parsedDateTime.hadTimeZone = hasTimeZoneOffset(dateTime);
    }
    return parsedDateTime;
  }
  if (typeof dateTime === 'number' && !isNaN(dateTime)) {
    DateTime.fromMillis(dateTime);
  }
  if (dateTime instanceof Date) {
    return DateTime.fromJSDate(dateTime);
  }
  if (dateTime instanceof DateTime) {
    return dateTime.clone();
  }
  let parsedDateTime = DateTime.fromISO(dateTime);
  if (parsedDateTime.isValid) {
    parsedDateTime.hadTimeZone = hasTimeZoneOffset(dateTime);
  }
  return parsedDateTime;
}
function ordinal(day) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}
class LuxonDateTime {
  static {
    g(this.prototype, "dateTime", [tracked]);
  }
  #dateTime = (i(this, "dateTime"), void 0);
  constructor(dateTime) {
    this.dateTime = parseDateTime(dateTime);
  }
  format(formatString) {
    if (isBlank(formatString)) return this.dateTime.toISO();
    let formatStringCopy = formatString;
    let tZCharacter;
    const shouldStripTimeZone = formatStringCopy.toLowerCase().endsWith(' z');
    if (shouldStripTimeZone) {
      tZCharacter = formatString[formatString.length - 1];
      formatStringCopy = formatStringCopy.slice(0, -2);
    }
    formatStringCopy = formatStringCopy.replace('llll', 'EEE, MMM d, yyyy h:mm a');
    formatStringCopy = formatStringCopy.replace('LLLL', 'EEEE, MMMM d, yyyy h:mm a');
    formatStringCopy = formatStringCopy.replace('lll', 'MMM d, yyyy h:mm a');
    formatStringCopy = formatStringCopy.replace('LLL', 'MMMM d, yyyy h:mm a');
    formatStringCopy = formatStringCopy.replace('ll', 'MMM d, yyyy');
    formatStringCopy = formatStringCopy.replace('LL', 'MMMM d, yyyy');
    formatStringCopy = formatStringCopy.replace('l', 'M/d/yyyy');
    formatStringCopy = formatStringCopy.replace('L', 'MM/dd/yyyy');
    formatStringCopy = formatStringCopy.replace('ddd', 'EEE');
    if (shouldStripTimeZone && this.dateTime.hadTimeZone) {
      tZCharacter = tZCharacter === 'z' ? 'ZZZZ' : tZCharacter === 'Z' ? 'ZZ' : tZCharacter;
      let formattedStr = this.dateTime.toFormat(`${formatStringCopy} ${tZCharacter}`);
      if (formattedStr.includes('Do')) {
        const day = this.dateTime.day;
        return formattedStr.replace('Do', `${day}${ordinal(day)}`);
      }
      return formattedStr;
    }
    return this.dateTime.toFormat(formatStringCopy);
  }
}

export { LuxonDateTime as default };
//# sourceMappingURL=luxon-date-time.js.map
