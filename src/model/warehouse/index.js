export * from './warehouse-site'
export * from './warehouse-zone'
export * from './warehouse-rack'
export * from './warehouse-bay'
export * from './warehouse-level'
export * from './warehouse-station'
export * from './warehouse-transaction-request'
export * from './warehouse-transaction-request-item'
export * from './warehouse-transaction-request-item-lot'

import {api} from 'src/plugins/axios'
import {LabelModel} from 'src/model/shared'
import {FetchableArray} from 'src/model/array'

export const WarehouseTransactionRequestStatusArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/warehouse/transaction-request-status-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)

export const WarehouseTransactionTypeArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/warehouse/transaction-type-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)

export const WarehouseTransactionQuantityCorrectionPolicyArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/warehouse/transaction-quantity-correction-policy-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)


