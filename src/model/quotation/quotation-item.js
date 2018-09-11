import {Model, uuid} from 'src/model/model'
import {BomModel} from 'src/model/bom'
import {api} from 'src/plugins/axios'
import {FetchableArray, SavableArray, ValidatableArray} from "src/model/array";

const bomSymbol = Symbol('bom')

export class QuotationItemModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      discountRate: 0
    }
  }

  get bom() {
    return this[bomSymbol]
  }

  get phantom() {
    return this.hasChanged("id")
  }

  async validate() {
    let constraints = {
      quotationId: {
        presence: true
      },
      itemId: {
        presence: true
      },
      discountRate: {
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

  async fetchReference() {
    const bom = await BomModel.getByItemId(this.itemId)
    this[bomSymbol] = bom
    await bom.fetchChildren(true, true)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post(
          `/quotation/quotations/${this.quotationId}/items`, this)
      this.assign(response.data)
    } else {
      await api.put(
          `/quotation/quotations/${this.quotationId}/items/${this.id}`, this)
    }
  }

  async delete() {
    await api.delete(
        `/quotation/quotations/${this.quotationId}/items/${this.id}`, {})
  }

}

export const QuotationItemArray = Array.decorate(
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {
      get url() {
        return '/quotation/quotations/${quotationId}/items'
      }

      get axios() {
        return api
      }

      get model() {
        return QuotationItemModel
      }

      initialize(quotation) {
        super.initialize()
        this.quotation = quotation
      }

      async fetch() {
        await super.fetch({
          quotationId: this.quotation.id
        })
        await Promise.all(this.map(async (element) => await element.fetchReference()))
      }

      applyEach(element){
        element.quotationId = this.quotation.id
      }

    }
)