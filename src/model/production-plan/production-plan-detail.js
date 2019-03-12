import {FetchableArray, SavableArray, ValidatableArray} from 'src/model/array'
import {Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {ItemModel, ItemSpecModel} from "src/model/item";
import {CompanyModel} from "src/model/company";
import {ProcessModel} from "src/model/process";
import {language, languageAliases} from "../../i18n";
import moment from "moment";
import * as _ from 'lodash'
import {ProductionPlanDetailMediatorModel} from "../production-mediator/production-mediator";

const itemSymbol = Symbol('item')
const itemSpecSymbol = Symbol('item-spec')
const progressCompanySymbol = Symbol('progress-company')
const processSymbol = Symbol('process')

const progressTypeUrlTemplates = {
  'OUTSOURCING': '/outsourcing-request/${id}',
  'PRODUCE': '/outsourcing-request/${id}',
  'WAREHOUSING': '/outsourcing-request/${id}',
  'PURCHASE': '/outsourcing-request/${id}'
};

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
      remark: null,
      determinable: false,
      receiverId: null
    }
  }

  get allowedProgressTypes() {
    if (this.processId) {
      return ['OUTSOURCING', 'PRODUCE']
    } else {
      return ['WAREHOUSING', 'PURCHASE']
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

  get determinable() {
    return this.status == 'CREATED' && this.actorId != null && this.progressType
        != null
        && this.receiverId != null;
  }

  async getLinkedUrl() {
    const mediator = await ProductionPlanDetailMediatorModel.get(this.id)
    return _.template(progressTypeUrlTemplates[this.progressType])({
      id: mediator.linkedId
    })
  }

  static async get(id, cacheable) {
    if (!id) {
      return new ProductionPlanDetailModel()
    }
    const response = await api.get(
        `/production-plan/details/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new ProductionPlanDetailModel(response.data)
  }


  async fetchReference() {
    this[itemSymbol] = await ItemModel.get(this.itemId, true)
    this[itemSpecSymbol] = await ItemSpecModel.get(this.itemSpecId, true)
    this[progressCompanySymbol] = await CompanyModel.get(this.actorId,
        true)
    this[processSymbol] = await ProcessModel.get(this.processId, true)
  }

  async save() {
    const planId = this.planId
    if (this.phantom) {
      const response = await api.post(
          `/production-plan/details`,
          this)
      this.assign(response.data)
    } else {
      await api.put(
          `/production-plan/details/${this.id}`,
          this)
    }
  }

  async determine() {
    await api.put(
        `/production-plan/details/${this.id}/determine`,
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
      progressType: {
        inclusion: ['OUTSOURCING', 'PRODUCE', 'WAREHOUSING', 'PURCHASE']
      },
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
        `/production-plan/details/${this.id}`,
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