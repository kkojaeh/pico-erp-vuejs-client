import {Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {FetchableArray} from "../array";

export class QuotationAdditionModel extends Model {
  get defaults() {
    return {
      name: '',
      unitPrice: 0,
      quantity: 1
    }
  }

  get phantom() {
    return !this.id
  }

  async save() {
    if (this.phantom) {
      this.id = uuid()
      const response = await api.post(
          `/quotation/quotations/${this.quotationId}/additions`, this)
      this.assign(response.data)
    } else {
      await api.put(
          `/quotation/quotations/${this.quotationId}/additions/${this.id}`, this)
    }
  }

  async remove() {
    await api.delete(
        `/quotation/quotations/${this.quotationId}/additions/${this.id}`, {})
  }

}

const removedSymbol = Symbol('removed')

export const QuotationAdditionArray = Array.decorate(
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

      initialize(quotationId) {
        super.initialize()
        this.quotationId = quotationId
        this[removedSymbol] = []
      }

      async query() {
        await this.fetch({
          quotationId: this.quotationId
        })
        await Promise.all(this.map(async (item) => await item.fetch()))
      }

      async validate() {
        const results = await Promise.all(
            this.filter(element => !element.id || element.hasChanged())
            .map(address => address.validate())
        )
        // 결과가 false 인 유효하지 않은 값이 없다면 모두 유효함
        return results.filter(valid => valid == false).length == 0
      }

      async save() {
        await Promise.all(
            this.filter(element => !element.id || element.hasChanged())
            .map(address => address.save())
        )
        await Promise.all(
            this[removedSymbol].map(element => element.delete())
        )
        this[removedSymbol] = []
      }

      remove(element) {
        super.remove(element)
        if (!element.phantom) {
          this[removedSymbol].push(element)
        }
      }

      clear() {
        super.clear()
        this[removedSymbol] = []
      }
    }
)