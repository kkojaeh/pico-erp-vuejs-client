export * from './item'
export * from './item-spec'
export * from './item-spec-type'
export * from './item-category'
export * from './item-lot'
export * from './item-selector'
export * from './item-viewer'
export * from './item-spec-viewer'
export * from './item-lot-selector'

import {api} from 'src/plugins/axios'
import {CollectionArray, FetchableArray} from 'src/model/array'
import {LabelModel} from 'src/model/shared'

export const ItemTypeArray = Array.decorate(
    CollectionArray,
    class extends FetchableArray {
      get url() {
        return '/item/item-type-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)

export const ItemStatusArray = Array.decorate(
    CollectionArray,
    class extends FetchableArray {
      get url() {
        return '/item/item-status-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)