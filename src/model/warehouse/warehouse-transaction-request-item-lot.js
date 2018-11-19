import {FetchableArray, SavableArray, ValidatableArray} from 'src/model/array'
import {Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {ItemLotModel} from "src/model/item";

const itemLotSymbol = Symbol('itemLot')

export class WarehouseTransactionRequestItemLotModel extends Model {

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

  get itemLot() {
    return this[itemLotSymbol]
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
    this[itemLotSymbol] = await ItemLotModel.get(this.itemLotId, true)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post(
          `/warehouse/transaction-requests/${this.requestId}/items/${this.requestItemId}/lots`,
          this)
      this.assign(response.data)
    } else {
      await api.put(
          `/warehouse/transaction-requests/${this.requestId}/items/${this.requestItemId}/lots/${this.id}`,
          this)
    }
  }

  async validate() {
    let constraints = {
      quantity: {
        presence: true,
        numericality: {
          greaterThan: 0
        }
      },
      itemLotId: {
        presence: true
      }
    }

    return await this.$validate(constraints)
  }

  async delete() {
    await api.delete(
        `/warehouse/transaction-requests/${this.requestId}/items/${this.id}`,
        {})
  }
}

export const WarehouseTransactionRequestItemLotArray = Array.decorate(
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {
      get url() {
        return '/warehouse/transaction-requests/${requestId}/items/${requestItemId}/lots'
      }

      get axios() {
        return api
      }

      get model() {
        return WarehouseTransactionRequestItemLotModel
      }

      initialize(requestItem) {
        super.initialize()
        this.requestItem = requestItem
      }

      async fetch() {
        await super.fetch({
          requestId: this.requestItem.requestId,
          requestItemId: this.requestItem.id
        })
        await Promise.all(
            this.map(async (element) => await element.fetchReference()))
      }

      applyEach(element) {
        element.requestItemId = this.requestItem.id
      }

    }
)