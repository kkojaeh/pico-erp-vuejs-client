import {FetchableArray} from "../array";
import {api} from "../../plugins/axios";
import {LabelModel} from "../shared";

export * from './outsourced-invoice'
export * from './outsourced-invoice-item'

export const OutsourcedInvoiceStatusArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/outsourced-invoice/status-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)