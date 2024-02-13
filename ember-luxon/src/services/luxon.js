import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { DateTime } from 'luxon';
import { getOwner } from '@ember/application';
import LuxonDateTime from '../utils/luxon-date-time';

export default class LuxonService extends Service {
  @tracked locale;
  @tracked timeZone;
  @tracked defaultFormat;

  constructor() {
    super(...arguments);
    const now = DateTime.local();
    this.locale = now.locale;
    this.timeZone = now.timeZone;
    this.defaultFormat = this.__config__.outputFormat;
  }

  get __config__() {
    let config = getOwner(this).factoryFor('config:environment').class || {};

    return config['ember-luxon'] || {};
  }

  luxon() {
    return new LuxonDateTime(...arguments);
  }
}
