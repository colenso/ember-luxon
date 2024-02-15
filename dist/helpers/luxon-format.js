import { isEmpty } from '@ember/utils';
import { observer, get } from '@ember/object';
import computeFn from '../utils/helper-compute.js';
import BaseHelper from './-base.js';

class LuxonFormatHelper extends BaseHelper {
  // eslint-disable-next-line ember/no-observers
  defaultFormatDidChange = observer('luxon.defaultFormat', function () {
    this.recompute();
  });
  compute = computeFn(function (params, {
    locale,
    timeZone
  }) {
    this._super(...arguments);
    const luxon = this.luxon;
    const {
      length
    } = params;
    if (length > 3) {
      throw new TypeError('ember-luxon: Invalid number of arguments, expected at most 3');
    }
    const args = [];
    const formatArgs = [];
    // eslint-disable-next-line ember/no-get
    const defaultFormat = get(this, 'luxon.defaultFormat');
    args.push(params[0]);
    if (length === 1 && !isEmpty(defaultFormat)) {
      formatArgs.push(defaultFormat);
    } else if (length === 2) {
      formatArgs.push(params[1]);
    } else if (length > 2) {
      args.push(params[2]);
      formatArgs.push(params[1]);
    }
    return this.morphLuxon(luxon.luxon(...args), {
      locale,
      timeZone
    }).format(...formatArgs);
  });
}

export { LuxonFormatHelper as default };
//# sourceMappingURL=luxon-format.js.map
