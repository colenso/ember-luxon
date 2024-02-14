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
    switch (formatString) {
      case 'L':
        return this.dateTime.toFormat('MM/dd/yyyy');
      case 'l':
        return this.dateTime.toFormat('M/d/yyyy');
      case 'LL':
        return this.dateTime.toFormat('MMMM d, yyyy');
      case 'll':
        return this.dateTime.toFormat('MMM d, yyyy');
      case 'LLL':
        return this.dateTime.toFormat('MMMM d, yyyy h:mm a');
      case 'lll':
        return this.dateTime.toFormat('MMM d, yyyy h:mm a');
      case 'LLLL':
        return this.dateTime.toFormat('EEEE, MMMM d, yyyy h:mm a');
      case 'llll':
        return this.dateTime.toFormat('EEE, MMM d, yyyy h:mm a');
      default:
        return this.dateTime.toFormat(formatString);
    }
  }
}
