import {FetchableArray, SavableArray, ValidatableArray} from 'src/model/array'
import {Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {ItemModel, ItemSpecModel} from "src/model/item";
import {CompanyModel} from "src/model/company";
import {ProcessModel} from "src/model/process";
import {language, languageAliases} from "../../i18n";
import moment from "moment";

const itemSymbol = Symbol('item')
const itemSpecSymbol = Symbol('item-spec')
const progressCompanySymbol = Symbol('progress-company')
const processSymbol = Symbol('process')

export class ProductionPlanDetailModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      status: 'DRAFT',
      quantity: 0,
      spareQuantity: 0,
      remark: null
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

  get progressCompany() {
    return this[progressCompanySymbol]
  }

  get process() {
    return this[processSymbol]
  }

  get phantom() {
    return this.hasChanged("id")
  }

  async fetchReference() {
    this[itemSymbol] = await ItemModel.get(this.itemId, true)
    this[itemSpecSymbol] = await ItemSpecModel.get(this.itemSpecId, true)
    this[progressCompanySymbol] = await CompanyModel.get(this.progressCompanyId,
        true)
    this[processSymbol] = await ProcessModel.get(this.processId, true)
  }

  async save() {
    const planId = this.planId
    if (this.phantom) {
      const response = await api.post(
          `/production-plan/plans/${planId}/details`,
          this)
      this.assign(response.data)
    } else {
      await api.put(
          `/production-plan/plans/${planId}/details/${this.id}`,
          this)
    }
  }

  async determine() {
    await api.put(
        `/production-plan/plans/${this.planId}/details/${this.id}/determine`,
        this)
  }

  async validateDetermine() {
    let constraints = {
      determine: {
        'function': () => {
          const errors = []
          if (!this.determinable) {
            const error = languageAliases({
              ko: '확정 할 수 없습니다'
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
      quantity: {
        presence: true,
        numericality: {
          greaterThan: 0
        }
      },
      spareQuantity: {
        presence: true,
        numericality: {
          greaterThanOrEqualTo: 0
        }
      },
      startDate: {
        presence: true,
        datetime: {
          parse: (date) => moment(date),
          format: (date) => moment(date).format('YYYY-MM-DD')
        }
      },
      endDate: {
        presence: true,
        datetime: {
          parse: (date) => moment(date),
          format: (date) => moment(date).format('YYYY-MM-DD')
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
                ko: '품목의 스펙을 지정해야 합니다'
              })[language]
              errors.push(error)
            }
          }
          return errors
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
        `/production-plan/plans/${this.planId}/details/${this.id}`,
        {})
  }
}

export const ProductionPlanDetailArray = Array.decorate(
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {
      get url() {
        return '/production-plan/plans/${planId}/details'
      }

      get axios() {
        return api
      }

      get model() {
        return ProductionPlanDetailModel
      }

      initialize(plan) {
        super.initialize()
        this.plan = plan
      }

      async fetch() {
        await super.fetch({
          planId: this.plan.id
        })
        await Promise.all(
            this.map(async (element) => await element.fetchReference()))
      }

      applyEach(element) {
        element.planId = this.plan.id
      }

    }
)