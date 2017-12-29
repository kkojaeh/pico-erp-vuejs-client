import Vue from 'vue';
import ModalRouterView from '@/common/ModalRouterView.vue';

Vue.component('modal-router-view', ModalRouterView);

// jscs:disable
export function load(component) {
  // '@' is aliased to src/components
  return () => System.import(`@/${component}.vue`);
}

export function wrapModal(type, data = {}) {
  return () => {
    return new Promise((resolve) => {
      type().then((component) => {
        let modalClass = Vue.extend({
          extends: Vue.component('modal-router-view'),
          props: component.props,
          data() {
            return _.assign(data, {
              component: Vue.extend(component)
            });
          }
        });
        resolve(modalClass);
      });
    });
  };
};
