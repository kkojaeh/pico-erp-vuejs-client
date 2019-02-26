import {FetchableArray} from "../array";
import {api} from "../../plugins/axios";
import {LabelModel} from "../shared";

export * from './product-specification'
export * from './product-specification-viewer'
export * from './product-specification-content'
export * from './product-specification-content-process'

export const ProductSpecificationStatusArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/product-specification/status-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)