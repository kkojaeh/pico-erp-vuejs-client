import Vue from 'vue'
import ModalRouterView from './modal-router-view.vue'

Vue.component('modal-router-view', ModalRouterView)

export const wrapModal = async (loader, data = {}) => {
  const component = (await loader).default
  return Vue.extend({
    extends: Vue.component('modal-router-view'),
    props: component.props,
    data () {
      return _.defaults(data, {
        maximized: false,
        component: Vue.extend(component)
      })
    }
  })
}
