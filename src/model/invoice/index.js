import {FetchableArray} from "../array";
import {api} from "../../plugins/axios";
import {LabelModel} from "../shared";

export * from './invoice'
export * from './invoice-item'

export const InvoiceStatusArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/invoice/status-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)