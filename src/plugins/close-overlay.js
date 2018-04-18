// import something here
import * as _ from 'lodash'

// leave the export, even if you don't use it
export default ({app, router, Vue}) => {

  const targets = ['QPopover', 'QModal']
  const names = targets.concat(targets.map(_.kebabCase))
  Vue.prototype.$closeOverlay = function () {
    let vm = this
    while ((vm = vm.$parent)) {
      const name = vm.$options.name
      if (names.includes(name)) {
        vm.hide()
        break
      }
    }
  }
}
