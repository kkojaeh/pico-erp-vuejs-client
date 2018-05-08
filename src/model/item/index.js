export * from './item'
export * from './item-spec'
export * from './item-spec-type'
export * from './item-category'

import { api } from 'src/plugins/axios'
import { FetchableArray } from 'src/model/array'
import { LabelModel } from 'src/model/shared'

export class ItemTypeArray extends FetchableArray {
  url = '/item/item-type-labels'
  axios = api
  model = LabelModel
}

export class ItemStatusArray extends FetchableArray {
  url = '/item/item-status-labels'
  axios = api
  model = LabelModel
}