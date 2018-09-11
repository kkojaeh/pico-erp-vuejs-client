import {FetchableArray, SpringPaginationArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {LabelModel} from 'src/model/shared'
import {api} from 'src/plugins/axios'
import {date} from 'quasar'
import {language, languageAliases} from "../../i18n";

export class OrderAcceptanceModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      status: 'CREATED',
      deliveryAddress: {
        postalCode: null,
        street: null,
        detail: null
      }
    }
  }

  get defaultErrors() {
    return {
      deliveryAddress: {}
    }
  }

  get acceptable() {
    return !this.phantom && this.status == 'CREATED'
  }

  get modifiable() {
    return this.status == 'CREATED'
  }

  get phantom() {
    return this.hasChanged("id")
  }

  static async get(id, cacheable) {
    if (!id) {
      return new OrderAcceptanceModel()
    }
    const response = await api.get(
        `/order-acceptance/order-acceptances/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new OrderAcceptanceModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/order-acceptance/order-acceptances/${id}`)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/order-acceptance/order-acceptances',
          this)
      this.assign(response.data)
    } else {
      await api.put(`/order-acceptance/order-acceptances/${this.id}`, this)
    }
  }

  async accept() {
    await api.put(`/order-acceptance/order-acceptances/${this.id}/accept`, this)
  }

  async validateAccept() {
    let constraints = {
      accept: {
        'function': () => {
          const errors = []
          if (this.status !== 'CREATED') {
            const error = languageAliases({
              ko: '작성중 상태가 아닙니다'
            })[language]
            errors.push(error)
          }
          return errors
        }
      }
    }
    return await this.$validate(constraints)
  }

  async validate() {
    let constraints = {
      name: {
        presence: true,
        length: {minimum: 1, maximum: 50}
      },
      orderedDate: {
        presence: true
      },
      dueDate: {
        presence: true
      },
      customerId: {
        presence: true
      },
      managerId: {
        presence: true
      },
      purchaseOrderNumber: {
        length: {maximum: 20}
      },
      'deliveryAddress.postalCode': {
        length: {minimum: 5, maximum: 6}
      },
      'deliveryAddress.street': {
        length: {minimum: 10, maximum: 50}
      },
      'deliveryAddress.detail': {
        length: {minimum: 3, maximum: 50}
      },
      purchaserId: {
        presence: true
      },
      receiverId: {
        presence: true
      },
      projectId: {
        presence: true
      },
      deliveryTelephoneNumber: {
        length: {maximum: 20}
      },
      deliveryMobilePhoneNumber: {
        length: {maximum: 20}
      }
    }

    return await this.$validate(constraints)
  }
}

export const OrderAcceptancePaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/order-acceptance/order-acceptances?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return OrderAcceptanceModel
      }
    }
)

export const OrderAcceptanceLabelArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/order-acceptance/order-acceptance-query-labels?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }

      async fetch(keyword) {
        return super.fetch({
          query: keyword || ''
        })
      }
    }
)