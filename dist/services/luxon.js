import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { getOwner } from '@ember/application';
import LuxonDateTime from '../utils/luxon-date-time.js';
import { g, i } from 'decorator-transforms/runtime';

class LuxonService extends Service {
  static {
    g(this.prototype, "locale", [tracked]);
  }
  #locale = (i(this, "locale"), void 0);
  static {
    g(this.prototype, "timeZone", [tracked]);
  }
  #timeZone = (i(this, "timeZone"), void 0);
  static {
    g(this.prototype, "defaultFormat", [tracked]);
  }
  #defaultFormat = (i(this, "defaultFormat"), void 0);
  constructor() {
    super(...arguments);
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

export { LuxonService as default };
//# sourceMappingURL=luxon.js.map
