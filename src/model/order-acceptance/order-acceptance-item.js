import {FetchableArray, SavableArray, ValidatableArray} from 'src/model/array'
import {Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {ItemModel} from "src/model/item";

const itemSymbol = Symbol('item')

export class OrderAcceptanceItemModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      unitPrice: 0,
      quantity: 0
    }
  }

  get defaultErrors() {
    return {}
  }

  get item() {
    return this[itemSymbol]
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
          `/order-acceptance/order-acceptances/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
      return new ProjectModel(response.data)
    }

    static async exists(id) {
      return await exists(api, `/order-acceptance/order-acceptances/${id}`)
    }
  */

  async fetchReference() {
    this[itemSymbol] = await ItemModel.get(this.itemId, true)
  }

  async save() {
    const orderAcceptanceId = this.orderAcceptanceId
    if (this.phantom) {
      const response = await api.post(
          `/order-acceptance/order-acceptances/${orderAcceptanceId}/items`,
          this)
      this.assign(response.data)
    } else {
      await api.put(
          `/order-acceptance/order-acceptances/${orderAcceptanceId}/items/${this.id}`,
          this)
    }
  }

  async validate() {
    let constraints = {
      unitPrice: {
        presence: true,
        numericality: {
          greaterThan: 0
        }
      },
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

    return await this.$validate(constraints)
  }

  async delete() {
    await api.delete(
        `/order-acceptance/order-acceptances/${this.orderAcceptanceId}/items/${this.id}`,
        {})
  }
}

export const OrderAcceptanceItemArray = Array.decorate(
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {
      get url() {
        return '/order-acceptance/order-acceptances/${orderAcceptanceId}/items'
      }

      get axios() {
        return api
      }

      get model() {
        return OrderAcceptanceItemModel
      }

      initialize(orderAcceptance) {
        super.initialize()
        this.orderAcceptance = orderAcceptance
      }

      async query() {
        await this.fetch({
          orderAcceptanceId: this.orderAcceptance.id
        })
        await Promise.all(
            this.map(async (element) => await element.fetchReference()))
      }

      applyEach(element) {
        element.orderAcceptanceId = this.orderAcceptance.id
      }

    }
)