import {FetchableArray} from "../array";
import {api} from "../../plugins/axios";
import {LabelModel} from "../shared";

export * from './production-plan'
export * from './production-plan-detail'

export const ProductionPlanStatusArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/production-plan/status-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)

export const ProductionPlanDetailStatusArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/production-plan/detail-status-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)

export const ProductionPlanDetailProgressTypeArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/production-plan/detail-progress-type-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)