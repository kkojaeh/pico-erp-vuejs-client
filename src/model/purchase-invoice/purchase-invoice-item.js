import {FetchableArray, SavableArray, ValidatableArray} from 'src/model/array'
import {Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {PurchaseOrderItemModel} from "src/model/purchase-order";

const orderItemSymbol = Symbol('order-item')

export class PurchaseInvoiceItemModel extends Model {

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

  get orderItem() {
    return this[orderItemSymbol]
  }

  get phantom() {
    return this.hasChanged("id")
  }

  get updatable() {
    return this.requestItemId == null
  }

  async fetchReference() {
    this[orderItemSymbol] = await PurchaseOrderItemModel.get(this.orderItemId,
        true)
    await this.orderItem.fetchReference()
  }

  async save() {
    const invoiceId = this.invoiceId
    if (this.phantom) {
      const response = await api.post(
          `/purchase-invoice/invoices/${invoiceId}/items`,
          this)
      this.assign(response.data)
    } else {
      await api.put(
          `/purchase-invoice/invoices/${invoiceId}/items/${this.id}`,
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

  async delete() {
    await api.delete(
        `/purchase-invoice/invoices/${this.invoiceId}/items/${this.id}`,
        {})
  }
}

export const PurchaseInvoiceItemArray = Array.decorate(
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {
      get url() {
        return '/purchase-invoice/invoices/${invoiceId}/items'
      }

      get axios() {
        return api
      }

      get model() {
        return PurchaseInvoiceItemModel
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