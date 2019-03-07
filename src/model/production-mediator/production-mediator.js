import {exists, Model} from 'src/model/model'
import {api} from 'src/plugins/axios'

export class ProductionPlanDetailMediatorModel extends Model {

  constructor(data) {
    super(data)
  }

  get defaults() {
    return {}
  }

  get defaultErrors() {
    return {}
  }

  get phantom() {
    return this.hasChanged("id")
  }

  static async get(id, cacheable) {
    if (!id) {
      return new ProductionPlanDetailMediatorModel()
    }
    const response = await api.get(
        `/production-mediator/plan-details/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new ProductionPlanDetailMediatorModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/production-mediator/plan-details/${id}`)
  }

}