import {SpringPaginationArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {CompanyModel} from "src/model/company";
import {api} from 'src/plugins/axios'
import {language, languageAliases} from "../../i18n";

export class WarehouseTransactionRequestModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      transactionCompanyId: null,
      stationId: null,
      status: "CREATED",
      quantityCorrectionPolicy: 'NEGATIVE',
      modifiable: true
    }
  }

  get defaultErrors() {
    return {}
  }

  get phantom() {
    return this.hasChanged("id")
  }

  static async get(id, cacheable) {
    if (!id) {
      return new WarehouseTransactionRequestModel()
    }
    const response = await api.get(
        `/warehouse/transaction-requests/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new WarehouseTransactionRequestModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/warehouse/transaction-requests/${id}`)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/warehouse/transaction-requests', this)
      this.assign(response.data)
    } else {
      await api.put(`/warehouse/transaction-requests/${this.id}`, this)
    }
  }

  async commit() {
    await api.put(`/quotation/transaction-requests/${this.id}/commit`, {})
  }

  async validate() {
    let constraints = {
      dueDate: {
        presence: true
      },
      transactionCompanyId: {
        presence: true
      },
      type: {
        presence: true,
        inclusion: ['INBOUND', 'OUTBOUND']
      },
      quantityCorrectionPolicy: {
        presence: true,
        inclusion: ['NEGATIVE', 'ROUND_UP', 'ROUND_DOWN']
      },
      stationId: {
        'function': async () => {
          const errors = []
          const owner = await CompanyModel.owner()
          if (this.transactionCompanyId == owner.id) {
            if (!this.stationId) {
              const error = languageAliases({
                ko: '내부 위치를 지정해야 합니다'
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

  async validateCommit() {
    return await this.validate()
  }
}

export const WarehouseTransactionRequestPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/warehouse/transaction-requests?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return WarehouseTransactionRequestModel
      }
    }
)