import { tracked } from '@glimmer/tracking';
import { isBlank } from '@ember/utils';
import { DateTime } from 'luxon';

function parseDateTime(dateTime, fromFormat = null) {
  if (isBlank(dateTime)) return DateTime.local();
  if (fromFormat) {
    return DateTime.fromFormat(dateTime, fromFormat);
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
  return DateTime.fromISO(dateTime);
}

export default class LuxonDateTime {
  @tracked dateTime;

  constructor(dateTime) {
    this.dateTime = parseDateTime(dateTime);
  }

  format(formatString) {
    if (isBlank(formatString)) return this.dateTime.toISO();
    let formatStringCopy = formatString;
    let tZCharacter
    const shouldStripTimeZone = formatStringCopy.toLowerCase().endsWith(' z');
    if (shouldStripTimeZone) {
      tZCharacter = formatString[formatString.length - 1];
      formatStringCopy = formatStringCopy.slice(0, -2);
    }
    let luxonFormatString;
    switch (formatStringCopy) {
      case 'L':
        luxonFormatString = 'MM/dd/yyyy';
        break;
      case 'l':
        luxonFormatString = 'M/d/yyyy';
        break;
      case 'LL':
        luxonFormatString = 'MMMM d, yyyy';
        break;
      case 'll':
        luxonFormatString = 'MMM d, yyyy';
        break;
      case 'LLL':
        luxonFormatString = 'MMMM d, yyyy h:mm a';
        break;
      case 'lll':
        luxonFormatString = 'MMM d, yyyy h:mm a';
        break;
      case 'LLLL':
        luxonFormatString = 'EEEE, MMMM d, yyyy h:mm a';
        break;
      case 'llll':
        luxonFormatString = 'EEE, MMM d, yyyy h:mm a';
        break;
      default:
        luxonFormatString = formatStringCopy;
    }
    if (shouldStripTimeZone) {
      tZCharacter =
        tZCharacter === 'z' ? 'ZZZZ' : tZCharacter === 'Z' ? 'ZZ' : tZCharacter;
      return this.dateTime.toFormat(`${luxonFormatString} ${tZCharacter}`);
    }
    return this.dateTime.toFormat(luxonFormatString);
  }
}
