import { FetchableArray } from 'src/model/array'
import { Model } from 'src/model/model'
import { api } from 'src/plugins/axios'

export class UnitLabelArray extends FetchableArray {
  url = '/shared/unit-labels'
  axios = api
  model = LabelModel
}

export class LabelModel extends Model {

  constructor (data) {
    super(data)
    this.sublabel = this.subLabel
  }

}



