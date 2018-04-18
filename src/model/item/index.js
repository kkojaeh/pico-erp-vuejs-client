export * from './item'
export * from './item-spec'
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

export class ItemSpecTypeLabelArray extends FetchableArray {
  url = '/item/spec-type-query-labels?${$QS}'
  axios = api
  model = LabelModel

  query = (keyword) => {
    return this.fetch({
      query: keyword || ''
    })
  }
}