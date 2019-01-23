import {FetchableArray} from "../array";
import {api} from "../../plugins/axios";
import {LabelModel} from "../shared";

export * from './production-request'

export const ProductionRequestStatusArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/production-request/status-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)