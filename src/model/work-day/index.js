export * from './work-day'
export * from './work-time'

import {api} from 'src/plugins/axios'
import {FetchableArray} from 'src/model/array'
import {LabelModel} from 'src/model/shared'

export const WorkDayCategoryArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/work-day/category-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)