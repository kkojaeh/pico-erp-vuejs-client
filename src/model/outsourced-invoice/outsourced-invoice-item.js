import {FetchableArray, SavableArray, ValidatableArray} from 'src/model/array'
import {Model, uuid} from 'src/model/model'
import {ItemModel} from 'src/model/item'
import {api} from 'src/plugins/axios'

const itemSymbol = Symbol('item')

export class OutsourcedInvoiceItemModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      status: 'DRAFT',
      quantity: 0,
      remark: null,
      itemSpecCode: 'N/A'
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

  get updatable() {
    return this.requestItemId == null
  }

  async fetchReference() {
    this[itemSymbol] = await ItemModel.get(this.itemId, true)
  }

  async save() {
    const invoiceId = this.invoiceId
    if (this.phantom) {
      const response = await api.post(
          `/outsourced-invoice/invoices/${invoiceId}/items`,
          this)
      this.assign(response.data)
    } else {
      await api.put(
          `/outsourced-invoice/invoices/${invoiceId}/items/${this.id}`,
          this)
    }
  }

  async validate() {
    let constraints = {
      itemId: {
        presence: true
      },
      itemSpecCode: {
        presence: true
      },
      unit: {
        presence: true
      },
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

  async delete() {
    await api.delete(
        `/outsourced-invoice/invoices/${this.invoiceId}/items/${this.id}`,
        {})
  }
}

export const OutsourcedInvoiceItemArray = Array.decorate(
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {
      get url() {
        return '/outsourced-invoice/invoices/${invoiceId}/items'
      }

      get axios() {
        return api
      }

      get model() {
        return OutsourcedInvoiceItemModel
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