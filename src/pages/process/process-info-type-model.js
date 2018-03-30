import { FetchableArray } from 'src/model/array'
import { api } from 'src/plugins/axios'

export class ProcessInfoTypeLabelArray extends FetchableArray {
  url = '/process/process-info-type-query-labels'
  axios = api

  query = (keyword) => {
    return this.fetch({
      query: keyword
    })
  }
}


