import {Model, uuid} from 'src/model/model'
import {BomModel} from 'src/model/bom'
import {ProcessModel} from 'src/model/process'
import {ItemModel, ItemSpecModel} from 'src/model/item'
import {api} from 'src/plugins/axios'

const itemSpecSymbol = Symbol('itemSpec')
const processSymbol = Symbol('process')
const itemSymbol = Symbol('item')
const bomSymbol = Symbol('bom')
const quotationSymbol = Symbol('quotation')

export class QuotationBomItemModel extends Model {

  get defaults() {
    return {
      '@type': 'bom',
      unitPrice: {
        original: 0,
        directLabor: 0,
        indirectLabor: 0,
        indirectMaterial: 0,
        directMaterial: 0,
        indirectExpenses: 0,
        discountRate: 0
      }
    }
  }

  set bom(value) {
    this[bomSymbol] = value
  }

  get bom() {
    return this[bomSymbol]
  }

  get quotation() {
    return this[quotationSymbol]
  }

  set quotation(value) {
    this[quotationSymbol] = value
  }

  static create(bom) {
    return new QuotationBomItemModel({
      id: uuid(),
      bomId: bom.id
    })
  }

  async fetch() {
    const bom = await BomModel.get(this.bomId)
    this[bomSymbol] = bom
    await bom.fetchChildren(true)
    await bom.visit(async (node) => {
      node[itemSymbol] = await ItemModel.get(node.itemId, true)
      node[processSymbol] = await ProcessModel.get(node.processId, true)
      node[itemSpecSymbol] = await ItemSpecModel.get(node.itemSpecId, true)
      Object.defineProperties(node, {
        'item': {
          get: function () {
            return this[itemSymbol]
          }
        },
        'itemSpec': {
          get: function () {
            return this[itemSpecSymbol]
          }
        },
        'process': {
          get: function () {
            return this[processSymbol]
          }
        }
      })
    })
  }

  async save() {
    await api.put(`/quotation/quotations/${this.quotation.id}/items/${this.id}`,
        {
          item: this
        })
  }

  async remove() {
    await api.delete(
        `/quotation/quotations/${this.quotation.id}/items/${this.id}`, {})
  }

}