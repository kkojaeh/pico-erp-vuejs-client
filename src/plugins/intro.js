import 'intro.js/introjs.css'
import 'intro.js/themes/introjs-modern.css'
import introJs from 'intro.js'
import * as _ from 'lodash'

let related = {}

// leave the export, even if you don't use it
export default ({app, router, Vue}) => {

  Vue.prototype.$intro = () => {
    const intro = introJs()
    intro.setOptions({
      overlayOpacity: 0.4,
      doneLabel: '완료',
      hintButtonLabel: '알았습니다',
      nextLabel: '다음 &rarr;',
      prevLabel: '이전',
      skipLabel: '넘기기'
    })
    _.forIn(related, (value, key) => {
      if (_.isFunction(value.start)) {
        value.start()
      }
    })
    intro.onexit(() => {
      _.forIn(related, (value, key) => {
        if (_.isFunction(value.exit)) {
          value.exit()
        }
      })
    })
    intro.start()
  }

  Vue.mixin({
    beforeCreate: function () {
      const options = this.$options
      const intro = options.intro
      if (intro) {
        related[this._uid] = intro
      }
    },
    beforeDestroy () {
      delete related[this._uid]
    }
  })

}
