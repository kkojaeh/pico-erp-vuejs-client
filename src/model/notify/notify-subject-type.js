import {FetchableArray} from "../array";
import {api} from "../../plugins/axios";
import {Model} from 'src/model/model'

export const NotifySubjectTypeArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/notify/subject-types'
      }

      get axios() {
        return api
      }

      get model() {
        return Model
      }
    }
)