import {Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {
  CollectionArray,
  FetchableArray,
  SavableArray,
  ValidatableArray
} from "src/model/array";

export class QuotationAdditionModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      name: '',
      unitPrice: 0,
      quantity: 1
    }
  }

  get phantom() {
    return this.hasChanged("id")
  }

  async save() {
    if (this.phantom) {
      const response = await api.post(
          `/quotation/quotations/${this.quotationId}/additions`, this)
      this.assign(response.data)
    } else {
      await api.put(
          `/quotation/quotations/${this.quotationId}/additions/${this.id}`,
          this)
    }
  }

  async delete() {
    await api.delete(
        `/quotation/quotations/${this.quotationId}/additions/${this.id}`, {})
  }

  async validate() {
    let constraints = {
      quotationId: {
        presence: true
      },
      unitPrice: {
        presence: true,
        numericality: {
          greaterThanOrEqualTo: 0
        }
      },
      quantity: {
        presence: false,
        numericality: {
          greaterThanOrEqualTo: 0
        }
      },
      description: {
        length: {maximum: 200}
      },
      remark: {
        length: {maximum: 50}
      }
    }

    return await this.$validate(constraints)
  }

}

export const QuotationAdditionArray = Array.decorate(
    CollectionArray,
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {
      get url() {
        return '/quotation/quotations/${quotationId}/additions'
      }

      get axios() {
        return api
      }

      get model() {
        return QuotationAdditionModel
      }

      initialize(quotation) {
        super.initialize()
        this.quotation = quotation
      }

      async fetch() {
        await super.fetch({
          quotationId: this.quotation.id
        })
      }

      applyEach(element) {
        element.quotationId = this.quotation.id
      }

    }
)