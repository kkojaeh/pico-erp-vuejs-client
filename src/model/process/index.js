export * from './process-info-type'
export * from './process-type'
export * from './process-type-selector'
export * from './process'
export * from './process-viewer'
export * from './preparation-type'
export * from './preparation'
export * from './item-processes-viewer'

import {api} from 'src/plugins/axios'
import {LabelModel} from 'src/model/shared'
import {FetchableArray} from 'src/model/array'

export const ProcessDifficultyArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/process/process-difficulty-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)

export const ProcessStatusArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/process/process-status-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)