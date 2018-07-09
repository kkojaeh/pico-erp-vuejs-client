import {Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'

const quotationSymbol = Symbol('quotation')

export class QuotationItemAdditionRateModel extends Model {
  get defaults() {
    return {
      '@type': 'unit-price-rate',
      name: '',
      rate: 0
    }
  }

  get quotation() {
    return this[quotationSymbol]
  }

  set quotation(value) {
    this[quotationSymbol] = value
  }

  get value() {
    return this.rate
  }

  set value(value) {
    this.rate = value
  }

  static create() {
    return new QuotationItemAdditionRateModel({
      id: uuid()
    })
  }

  async save() {
    await api.put(
        `/quotation/quotations/${this.quotation.id}/item-addition-rates/${this.id}`,
        {
          itemAdditionRate: this
        })
  }

  async remove() {
    await api.delete(
        `/quotation/quotations/${this.quotation.id}/item-addition-rates/${this.id}`,
        {})
  }

}