import {FetchableArray, SavableArray, ValidatableArray} from 'src/model/array'
import {Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {ItemModel} from "src/model/item";
import {WarehouseTransactionRequestItemLotArray} from './warehouse-transaction-request-item-lot'

const itemSymbol = Symbol('item')

const lotsSymbol = Symbol('lots')

export class WarehouseTransactionRequestItemModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      quantity: 0
    }
  }

  get defaultErrors() {
    return {}
  }

  get item() {
    return this[itemSymbol]
  }

  get lots() {
    return this[lotsSymbol]
  }

  get phantom() {
    return this.hasChanged("id")
  }

  /*

    static async get(id, cacheable) {
      if (!id) {
        return new ProjectModel()
      }
      const response = await api.get(
          `/project/projects/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
      return new ProjectModel(response.data)
    }

    static async exists(id) {
      return await exists(api, `/project/projects/${id}`)
    }
  */

  async fetchReference() {
    this[itemSymbol] = await ItemModel.get(this.itemId, true)
    const lots = new WarehouseTransactionRequestItemLotArray(this)
    this[lotsSymbol] = lots
    if (!this.phantom) {
      await lots.fetch()
    }
  }

  async save() {
    if (this.phantom) {
      const response = await api.post(
          `/warehouse/transaction-requests/${this.requestId}/items`, this)
      this.assign(response.data)
    } else {
      await api.put(
          `/warehouse/transaction-requests/${this.requestId}/items/${this.id}`,
          this)
    }
    await this.lots.save()
  }

  async validate() {
    let constraints = {
      quantity: {
        presence: true,
        numericality: {
          greaterThan: 0
        }
      },
      itemId: {
        presence: true
      }
    }

    const valid = await this.lots.validate()

    return valid && await this.$validate(constraints)
  }

  async delete() {
    await api.delete(
        `/warehouse/transaction-requests/${this.requestId}/items/${this.id}`,
        {})
  }
}

export const WarehouseTransactionRequestItemArray = Array.decorate(
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {
      get url() {
        return '/warehouse/transaction-requests/${requestId}/items'
      }

      get axios() {
        return api
      }

      get model() {
        return WarehouseTransactionRequestItemModel
      }

      initialize(request) {
        super.initialize()
        this.request = request
      }

      async fetch() {
        await super.fetch({
          requestId: this.request.id
        })
        await Promise.all(
            this.map(async (element) => await element.fetchReference()))
      }

      applyEach(element) {
        element.requestId = this.request.id
      }

    }
)