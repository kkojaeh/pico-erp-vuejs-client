import {FetchableArray} from "../array";
import {api} from "../../plugins/axios";
import {LabelModel} from "../shared";

export * from './purchase-request'

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