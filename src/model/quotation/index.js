import {FetchableArray} from "src/model/array"
import {LabelModel} from "src/model/shared"
import {api} from "src/plugins/axios"

export * from './quotation'
export * from './quotation-item'
export * from './quotation-addition'
export * from './quotation-item-addition'

export const QuotationStatusArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/quotation/status-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)

export const QuotationExpiryPolicyArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/quotation/expiry-policy-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)

export class QuotationStatusCountPerMonthAggregateOptions {

  year = new Date().getFullYear()

}

export const QuotationStatusCountPerMonthAggregateArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/quotation/aggregate/statuses/count/month?${$QS}'
      }

      get axios() {
        return api
      }
    }
)
