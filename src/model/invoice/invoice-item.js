import {FetchableArray, SavableArray, ValidatableArray} from 'src/model/array'
import {Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {ItemLotModel, ItemModel} from "src/model/item";

const itemSymbol = Symbol('item')
const itemLotSymbol = Symbol('item-lot')

export class InvoiceItemModel extends Model {

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

  get itemLot() {
    return this[itemLotSymbol]
  }

  get phantom() {
    return this.hasChanged("id")
  }

  get updatable() {
    return this.requestItemId == null
  }

  async fetchReference() {
    this[itemSymbol] = await ItemModel.get(this.itemId, true)
    this[itemLotSymbol] = await ItemLotModel.get(this.itemLotId, true)
  }

  async save() {
    const invoiceId = this.invoiceId
    if (this.phantom) {
      const response = await api.post(
          `/invoice/invoices/${invoiceId}/items`,
          this)
      this.assign(response.data)
    } else {
      await api.put(
          `/invoice/invoices/${invoiceId}/items/${this.id}`,
          this)
    }
  }

  async validate() {
    let constraints = {
      quantity: {
        presence: true,
        numericality: {
          greaterThanOrEqualTo: 0
        }
      },
      remark: {
        length: {maximum: 50}
      }
    }

    return await this.$validate(constraints)
  }

}

export const InvoiceItemArray = Array.decorate(
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {
      get url() {
        return '/invoice/invoices/${invoiceId}/items'
      }

      get axios() {
        return api
      }

      get model() {
        return InvoiceItemModel
      }

      initialize(invoice) {
        super.initialize()
        this.invoice = invoice
      }

      async fetch() {
        await super.fetch({
          invoiceId: this.invoice.id
        })
        await Promise.all(
            this.map(async (element) => await element.fetchReference()))
      }

      applyEach(element) {
        element.invoiceId = this.invoice.id
      }

    }
)