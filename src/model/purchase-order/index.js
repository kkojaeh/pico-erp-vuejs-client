import {FetchableArray} from "../array";
import {api} from "../../plugins/axios";
import {LabelModel} from "../shared";

export * from './purchase-order'
export * from './purchase-order-item'

export const PurchaseOrderStatusArray = Array.decorate(
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

export const PurchaseOrderItemStatusArray = Array.decorate(
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