import {FetchableArray} from "../array";
import {api} from "../../plugins/axios";
import {LabelModel} from "../shared";

export * from './production-order'

export const ProductionOrderStatusArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/production-order/status-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)