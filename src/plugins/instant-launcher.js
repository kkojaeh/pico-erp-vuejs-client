// import something here

import audit from './instant-launcher/audit'
import bom from './instant-launcher/bom'
import company from './instant-launcher/company'
import item from './instant-launcher/item'
import process from './instant-launcher/process'
import project from './instant-launcher/project'

// leave the export, even if you don't use it
export default (context) => {
  audit(context)
  bom(context)
  company(context)
  item(context)
  process(context)
  project(context)
  context.Vue.prototype.$await = function (miliseconds) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, miliseconds)
    })
  }
  // something to do
}
