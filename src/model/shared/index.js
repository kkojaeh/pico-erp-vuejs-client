import {CollectionArray, FetchableArray} from 'src/model/array'
import {Model} from 'src/model/model'
import {api} from 'src/plugins/axios'

export const UnitLabelArray = Array.decorate(
    CollectionArray,
    class extends FetchableArray {
      get url() {
        return '/shared/unit-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)

export class LabelModel extends Model {

  constructor(data) {
    super(data)
    this.sublabel = this.subLabel
  }

}



