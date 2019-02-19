import {FetchableArray} from "../array";
import {api} from "../../plugins/axios";
import {LabelModel} from "../shared";

export * from './outsourcing-request'
export * from './outsourcing-request-material'

export const OutsourcingRequestStatusArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/outsourcing-request/status-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)