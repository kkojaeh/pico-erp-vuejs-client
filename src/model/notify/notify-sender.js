import {FetchableArray} from "../array";
import {api} from "../../plugins/axios";
import {Model} from 'src/model/model'

export const NotifySenderArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/notify/senders'
      }

      get axios() {
        return api
      }

      get model() {
        return Model
      }
    }
)