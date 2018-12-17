import {Model, uuid} from "../model";
import {api} from "../../plugins/axios";
import {ProcessModel} from "../process";
import {
  CollectionArray,
  FetchableArray,
  SavableArray,
  ValidatableArray
} from "../array";

const processSymbol = Symbol('process')

export class BomProcessModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      conversionRate: 1
    }
  }

  get phantom() {
    return !this.id || this.hasChanged("id")
  }

  get process() {
    return this[processSymbol]
  }

  static async get(id) {
    const response = await api.get(`/bom/boms/${id}/processes`)
    return new BomProcessModel(response.data)
  }

  async fetchReference() {
    this[processSymbol] = await ProcessModel.get(this.processId, true)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post(`/bom/boms/${this.bomId}/processes`, this)
      this.assign(response.data)
    } else {
      await api.put(`/bom/boms/${this.bomId}/processes/${this.id}`, this)
    }
  }

  async changeOrder(order) {
    await api.put(`/bom/boms/${this.bomId}/processes/${this.id}/order`, {
      order: order
    })
  }

  async validate() {
    let constraints = {
      processId: {
        presence: false
      },
      bomId: {
        presence: true
      },
      conversionRate: {
        presence: true,
        numericality: {
          greaterThan: 0
        }
      }
    }
    return await this.$validate(constraints)
  }
}

export const BomProcessArray = Array.decorate(
    CollectionArray,
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {
      get url() {
        return '/bom/boms/${bomId}/processes'
      }

      get axios() {
        return api
      }

      get model() {
        return BomProcessModel
      }

      initialize(bom) {
        super.initialize()
        this.bom = bom
      }

      async fetch() {
        await super.fetch({
          bomId: this.bom.id
        })
        await Promise.all(
            this.map(async (e) => await e.fetchReference())
        )
        return
      }

      applyEach(element) {
        element.bomId = this.bom.id
      }

    }
)