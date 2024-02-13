import { tracked } from '@glimmer/tracking';
import { isBlank } from '@ember/utils';
import { DateTime } from 'luxon';

function parseDateTime(dateTime, fromFormat = null) {
  if (isBlank(dateTime)) return DateTime.now();
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
    return this.dateTime.toFormat(formatString);
  }
}
