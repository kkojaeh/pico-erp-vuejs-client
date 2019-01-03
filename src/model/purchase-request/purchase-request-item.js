import {FetchableArray, SavableArray, ValidatableArray} from 'src/model/array'
import {Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {ItemModel, ItemSpecModel} from "src/model/item";
import {language, languageAliases} from "../../i18n";

const itemSymbol = Symbol('item')
const itemSpecSymbol = Symbol('item-spec')

export class PurchaseRequestItemModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      status: 'DRAFT',
      quantity: 0
    }
  }

  get defaultErrors() {
    return {}
  }

  get item() {
    return this[itemSymbol]
  }

  get itemSpec() {
    return this[itemSpecSymbol]
  }

  get phantom() {
    return this.hasChanged("id")
  }

  async fetchReference() {
    this[itemSymbol] = await ItemModel.get(this.itemId, true)
    this[itemSpecSymbol] = await ItemSpecModel.get(this.itemSpecId, true)
  }

  async save() {
    const requestId = this.requestId
    if (this.phantom) {
      const response = await api.post(
          `/purchase-request/requests/${requestId}/items`,
          this)
      this.assign(response.data)
    } else {
      await api.put(
          `/purchase-request/requests/${requestId}/items/${this.id}`,
          this)
    }
  }

  async validate() {
    let constraints = {
      quantity: {
        presence: true,
        numericality: {
          greaterThan: 0
        }
      },
      itemId: {
        presence: true
      },
      itemSpecId: {
        'function': async () => {
          const errors = []
          if (this.item.specifiable) {
            if (!this.itemSpecId) {
              const error = languageAliases({
                ko: '품목의 스펙을 지정해야 합니'
              })[language]
              errors.push(error)
            }
          }
          return errors
        }
      }
    }

    return await this.$validate(constraints)
  }

  async delete() {
    await api.delete(
        `/purchase-request/requests/${this.requestId}/items/${this.id}`,
        {})
  }
}

export const PurchaseRequestItemArray = Array.decorate(
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {
      get url() {
        return '/purchase-request/requests/${requestId}/items'
      }

      get axios() {
        return api
      }

      get model() {
        return PurchaseRequestItemModel
      }

      initialize(request) {
        super.initialize()
        this.request = request
      }

      async fetch() {
        await super.fetch({
          requestId: this.request.id
        })
        await Promise.all(
            this.map(async (element) => await element.fetchReference()))
      }

      applyEach(element) {
        element.requestId = this.request.id
      }

    }
)