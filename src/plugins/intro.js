import 'intro.js/introjs.css'
import 'intro.js/themes/introjs-modern.css'
import introJs from 'intro.js'
import numberToText from 'number-to-text'

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {

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
    return intro
  }

}
