export * from './process-info-type'
export * from './process-type'
export * from './process'

import { api } from 'src/plugins/axios'
import { LabelModel } from 'src/model/shared'
import { FetchableArray } from 'src/model/array'

export class ProcessDifficultyArray extends FetchableArray {
  url = '/process/process-difficulty-labels'
  axios = api
  model = LabelModel
}

export class ProcessStatusArray extends FetchableArray {
  url = '/process/process-status-labels'
  axios = api
  model = LabelModel
}