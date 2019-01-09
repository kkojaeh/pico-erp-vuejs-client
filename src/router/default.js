import Vue from 'vue'
import ModalRouterView from './modal-router-view.vue'

Vue.component('modal-router-view', ModalRouterView)

export const wrapModal = async (loader, data = {}, defaultConfig = {}) => {
  const component = (await loader).default
  const config = _.defaults(defaultConfig, {
    extends: Vue.component('modal-router-view'),
    props: component.props,
    data () {
      return _.defaults(data, {
        maximized: false,
        component: Vue.extend(component)
      })
    }
  })
  if(component.beforeRouteEnter){
    config.beforeRouteEnter = component.beforeRouteEnter
  }
  if(component.beforeRouteLeave){
    config.beforeRouteLeave = function() {
      component.beforeRouteLeave.apply(this.$refs.component, Array.from(arguments))
    }
  }
  return Vue.extend(config)
}
