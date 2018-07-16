import {Model, uuid} from 'src/model/model'
import {BomModel} from 'src/model/bom'
import {api} from 'src/plugins/axios'
import {FetchableArray} from "src/model/array";

const bomSymbol = Symbol('bom')

export class QuotationItemModel extends Model {

  get defaults() {
    return {
      discountRate: 0
    }
  }

  get bom() {
    return this[bomSymbol]
  }

  get phantom() {
    return !this.id
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

  async fetch() {
    const bom = await BomModel.getByItemId(this.itemId)
    this[bomSymbol] = bom
    await bom.fetchChildren(true, true)
  }

  async save() {
    if (this.phantom) {
      this.id = uuid()
      const response = await api.post(
          `/quotation/quotations/${this.quotationId}/items`, this)
      this.assign(response.data)
    } else {
      await api.put(
          `/quotation/quotations/${this.quotationId}/items/${this.id}`, this)
    }
  }

  async remove() {
    await api.delete(
        `/quotation/quotations/${this.quotationId}/items/${this.id}`, {})
  }

}

const removedSymbol = Symbol('removed')

export const QuotationItemArray = Array.decorate(
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