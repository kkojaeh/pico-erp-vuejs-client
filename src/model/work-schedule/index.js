export * from './work-schedule'
export * from './work-schedule-time'

import {api} from 'src/plugins/axios'
import {FetchableArray} from 'src/model/array'
import {LabelModel} from 'src/model/shared'

export const WorkScheduleCategoryArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/work-schedule/category-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)