import { run } from '@ember/runloop';
import Helper from '@ember/component/helper';
import { observer } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

// eslint-disable-next-line ember/no-classic-classes
export default class BaseHelper extends Helper {
  @service luxon;

  @tracked disableInterval = false;

  @tracked supportsGlobalAllowEmpty = true;

  get globalAllowEmpty() {
    return this.luxon.__config__.allowEmpty;
  }

  // eslint-disable-next-line ember/no-observers
  localeOrTimeZoneChanged = observer(
    'luxon.locale',
    'luxon.timeZone',
    function () {
      this.recompute();
    },
  );

  compute(value, { interval }) {
    if (this.disableInterval) {
      return;
    }

    this.clearTimer();

    if (interval) {
      /*
       * NOTE: intentionally a setTimeout so tests do not block on it
       * as the run loop queue is never clear so tests will stay locked waiting
       * for queue to clear.
       */
      this.intervalTimer = setTimeout(
        () => {
          run(() => this.recompute());
        },
        parseInt(interval, 10),
      );
    }
  }

  morphLuxon(time, { locale, timeZone }) {
    const luxonService = this.luxon;

    locale = locale || luxonService.locale;
    timeZone = timeZone || luxonService.timeZone;

    if (locale && time.locale) {
      time = time.setLocale(locale);
    }

    if (timeZone && time.tz) {
      time = time.setZone(timeZone);
    }

    return time;
  }

  clearTimer() {
    clearTimeout(this.intervalTimer);
  }

  willDestroy() {
    this.clearTimer();
    super.willDestroy(...arguments);
  }
}
