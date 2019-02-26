import {FetchableArray, SavableArray, ValidatableArray} from 'src/model/array'
import {Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {ItemModel} from "src/model/item";
import {ProcessModel} from "src/model/process";
import {ProjectModel} from "src/model/project";
import {language, languageAliases} from "../../i18n";

const itemSymbol = Symbol('item')
const processSymbol = Symbol('process')
const projectSymbol = Symbol('project')

export class OutsourcingOrderItemModel extends Model {

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

  get process() {
    return this[processSymbol]
  }

  get project() {
    return this[projectSymbol]
  }

  get phantom() {
    return this.hasChanged("id")
  }

  get updatable() {
    return this.requestId == null
  }

  get outsourcingUnit() {
    return this.unit
  }

  get outsourcingEstimatedUnitCost() {
    return this.estimatedUnitCost
  }

  static async get(id, cacheable) {
    if (!id) {
      return new OutsourcingOrderItemModel()
    }
    const response = await api.get(
        `/outsourcing-order/items/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new OutsourcingOrderItemModel(response.data)
  }

  async fetchReference() {
    this[itemSymbol] = await ItemModel.get(this.itemId, true)
    this[processSymbol] = await ProcessModel.get(this.processId, true)
    this[projectSymbol] = await ProjectModel.get(this.projectId, true)
  }

  async save() {
    const orderId = this.orderId
    this.unit = this.outsourcingUnit
    if (this.phantom) {
      const response = await api.post(
          `/outsourcing-order/orders/${orderId}/items`,
          this)
      this.assign(response.data)
    } else {
      await api.put(
          `/outsourcing-order/orders/${orderId}/items/${this.id}`,
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
      projectId: {
        presence: true
      },
      itemSpecId: {
        'function': async () => {
          const errors = []
          if (this.item.specifiable) {
            if (!this.itemSpecId) {
              const error = languageAliases({
                ko: '품목의 스펙을 지정해야 합니다'
              })[language]
              errors.push(error)
            }
          }
          return errors
        }
      },
      remark: {
        length: {maximum: 50}
      }
    }

    return await this.$validate(constraints)
  }

  async delete() {
    await api.delete(
        `/outsourcing-order/orders/${this.orderId}/items/${this.id}`,
        {})
  }
}

export const OutsourcingOrderItemArray = Array.decorate(
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {
      get url() {
        return '/outsourcing-order/orders/${orderId}/items'
      }

      get axios() {
        return api
      }

      get model() {
        return OutsourcingOrderItemModel
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