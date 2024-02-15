import { isBlank } from '@ember/utils';

function computeFn (cb) {
  return function (params, hash) {
    if (!params || params && params.length === 0) {
      throw new TypeError('ember-luxon: Invalid Number of arguments, expected at least 1');
    }
    const datetime = params[0];
    let allowEmpty = hash.allowEmpty || hash['allow-empty'];
    if (allowEmpty === undefined || allowEmpty === null) {
      allowEmpty = this.globalAllowEmpty;
    }
    if (isBlank(datetime)) {
      if (allowEmpty) {
        return;
      }

      /* eslint-disable no-console */
      console.warn(`ember-luxon: an empty value (null, undefined, or "") was passed to ember-luxon helper`);
    }
    return cb.apply(this, arguments);
  };
}

export { computeFn as default };
//# sourceMappingURL=helper-compute.js.map
