import {FetchableArray} from "../array";
import {api} from "../../plugins/axios";
import {LabelModel} from "../shared";

export * from './oursourcing-order'
export * from './outsourcing-order-item'
export * from './outsourcing-order-material'

export const OutsourcingOrderStatusArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/purchase-order/status-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)

export const OutsourcingOrderItemStatusArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/purchase-order/item-status-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)