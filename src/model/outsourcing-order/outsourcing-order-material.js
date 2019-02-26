import {FetchableArray, SavableArray, ValidatableArray} from 'src/model/array'
import {Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {ItemModel} from "src/model/item";
import {CompanyModel} from "src/model/company";
import moment from "moment";

const itemSymbol = Symbol('item')
const supplierSymbol = Symbol('supplier')

export class OutsourcingOrderMaterialModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      status: 'DRAFT',
      quantity: 0,
      remark: null,
      unitCost: 0
    }
  }

  get defaultErrors() {
    return {}
  }

  get item() {
    return this[itemSymbol]
  }

  get supplier() {
    return this[supplierSymbol]
  }

  get phantom() {
    return this.hasChanged("id")
  }

  static async get(id, cacheable) {
    if (!id) {
      return new OutsourcingOrderMaterialModel()
    }
    const response = await api.get(
        `/outsourcing-order/materials/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new OutsourcingOrderMaterialModel(response.data)
  }

  async fetchReference() {
    this[itemSymbol] = await ItemModel.get(this.itemId, true)
    this[supplierSymbol] = await CompanyModel.get(this.supplierId, true)
  }

  async save() {
    const orderId = this.orderId
    this.unit = this.outsourcingUnit
    if (this.phantom) {
      const response = await api.post(
          `/outsourcing-order/orders/${orderId}/materials`,
          this)
      this.assign(response.data)
    } else {
      await api.put(
          `/outsourcing-order/orders/${orderId}/materials/${this.id}`,
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
      unitCost: {
        presence: true,
        numericality: {
          greaterThan: 0
        }
      },
      itemId: {
        presence: true
      },
      estimatedSupplyDate: {
        presence: true,
        datetime: {
          parse: (date) => moment(date),
          format: (date) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
          earliest: new Date()
        }
      },
      supplierId: {
        presence: true
      },
      remark: {
        length: {maximum: 50}
      }
    }

    return await this.$validate(constraints)
  }

  async delete() {
    await api.delete(
        `/outsourcing-order/orders/${this.orderId}/materials/${this.id}`,
        {})
  }
}

export const OutsourcingOrderMaterialArray = Array.decorate(
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {
      get url() {
        return '/outsourcing-order/orders/${orderId}/materials'
      }

      get axios() {
        return api
      }

      get model() {
        return OutsourcingOrderMaterialModel
      }

      initialize(order) {
        super.initialize()
        this.order = order
      }

      async fetch() {
        await super.fetch({
          orderId: this.order.id
        })
        await Promise.all(
            this.map(async (element) => await element.fetchReference()))
      }

      applyEach(element) {
        element.orderId = this.order.id
      }

    }
)