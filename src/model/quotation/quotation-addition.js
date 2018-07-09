import {Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'

const quotationSymbol = Symbol('quotation')

export class QuotationAdditionModel extends Model {
  get defaults() {
    return {
      name: '',
      unitPrice: 0,
      quantity: 1
    }
  }

  get quotation() {
    return this[quotationSymbol]
  }

  set quotation(value) {
    this[quotationSymbol] = value
  }

  static create() {
    return new QuotationAdditionModel({
      id: uuid()
    })
  }

  async save() {
    await api.put(
        `/quotation/quotations/${this.quotation.id}/additions/${this.id}`, {
          addition: this
        })
  }

  async remove() {
    await api.delete(
        `/quotation/quotations/${this.quotation.id}/additions/${this.id}`, {})
  }

}