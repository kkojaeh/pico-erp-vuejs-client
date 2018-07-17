import {Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {FetchableArray, SavableArray, ValidatableArray} from "../array";
import {QuotationAdditionModel} from "./quotation-addition";


export class QuotationItemAdditionModel extends Model {

  get defaults() {
    return {
      name: '',
      additionalRate: 0
    }
  }

  get phantom() {
    return !this.id
  }

  async save() {
    if (this.phantom) {
      this.id = uuid()
      const response = await api.post(`/quotation/quotations/${this.quotationId}/item-additions`, this)
      this.assign(response.data)
    }else {
      await api.put(
          `/quotation/quotations/${this.quotationId}/item-additions/${this.id}`, this)
    }
  }

  async delete() {
    await api.delete(
        `/quotation/quotations/${this.quotationId}/item-additions/${this.id}`,
        {})
  }

  async validate() {
    let constraints = {
      quotationId: {
        presence: true
      },
      additionalRate: {
        presence: true,
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

}

export const QuotationItemAdditionArray = Array.decorate(
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {
      get url() {
        return '/quotation/quotations/${quotationId}/item-additions'
      }

      get axios() {
        return api
      }

      get model() {
        return QuotationItemAdditionModel
      }

      initialize(quotation) {
        super.initialize()
        this.quotation = quotation
      }

      async query() {
        await this.fetch({
          quotationId: this.quotation.id
        })
      }

      applyEach(element){
        element.quotationId = this.quotation.id
      }
    }
)