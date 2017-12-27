import * as _ from 'lodash';

let visitor = (model) => {
  if (model.$touch) {
    model.$$touch = function () {// eslint-disable-line
      let me = this;
      return new Promise((resolve) => {
        me.$touch();
        let ifNotPendingThenResolve = () => {
          if (me.$pending) {
            setTimeout(ifNotPendingThenResolve, 100);
          } else {
            resolve();
          }
        };
        ifNotPendingThenResolve();
      });
    }.bind(model);
    _.values(model)
    .filter((v) => !!v.$touch)
    .forEach(visitor);
  }
};

export default {
  beforeMount: function () {// eslint-disable-line
    if (this.$v) {
      visitor(this.$v);
    }
  }
};
