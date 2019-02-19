import {FetchableArray, SavableArray, ValidatableArray} from 'src/model/array'
import {Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {ItemModel} from "src/model/item";
import {CompanyModel} from "src/model/company";
import moment from "moment";

const itemSymbol = Symbol('item')
const supplierSymbol = Symbol('supplier')

export class OutsourcingRequestMaterialModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      status: 'DRAFT',
      quantity: 0,
      remark: null
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

  async fetchReference() {
    this[itemSymbol] = await ItemModel.get(this.itemId, true)
    this[supplierSymbol] = await CompanyModel.get(this.supplierId, true)
  }

  async save() {
    const requestId = this.requestId
    if (this.phantom) {
      const response = await api.post(
          `/outsourcing-request/requests/${requestId}/materials`,
          this)
      this.assign(response.data)
    } else {
      await api.put(
          `/outsourcing-request/requests/${requestId}/materials/${this.id}`,
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
        `/outsourcing-request/requests/${this.requestId}/materials/${this.id}`,
        {})
  }
}

export const OutsourcingRequestMaterialArray = Array.decorate(
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {
      get url() {
        return '/outsourcing-request/requests/${requestId}/materials'
      }

      get axios() {
        return api
      }

      get model() {
        return OutsourcingRequestMaterialModel
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