import {FetchableArray} from "../array";
import {api} from "../../plugins/axios";
import {LabelModel} from "../shared";

export * from './purchase-request'
export * from './purchase-request-item'

export const PurchaseRequestStatusArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/purchase-request/status-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)

export const PurchaseRequestItemStatusArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/purchase-request/item-status-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)