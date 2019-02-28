import {FetchableArray} from "../array";
import {api} from "../../plugins/axios";
import {LabelModel} from "../shared";

export * from './outsourcing-invoice'
export * from './outsourcing-invoice-item'
export * from './outsourcing-invoice-viewer'

export const OutsourcingInvoiceStatusArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/outsourcing-invoice/status-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)