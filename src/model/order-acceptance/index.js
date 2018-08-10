import {FetchableArray} from "src/model/array";
import {api} from "src/plugins/axios";
import {LabelModel} from 'src/model/shared'

export * from './order-acceptance'
export * from './order-acceptance-item'

export const OrderAcceptanceStatusArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/order-acceptance/status-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)