import {FetchableArray} from "../array";
import {api} from "../../plugins/axios";
import {LabelModel} from "../shared";

export * from './purchase-invoice'
export * from './purchase-invoice-item'

export const PurchaseInvoiceStatusArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/purchase-invoice/status-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)