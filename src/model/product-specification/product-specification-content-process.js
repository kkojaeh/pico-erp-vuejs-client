import {FetchableArray, SavableArray, ValidatableArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {date} from 'quasar'
import {
  ProcessInfoTypeModel,
  ProcessModel,
  ProcessTypeModel
} from "src/model/process";

const processSymbol = Symbol('process')
const processTypeSymbol = Symbol('process-type')
const processInfoTypeSymbol = Symbol('process-info-type')

export class ProductSpecificationContentProcessModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {}
  }

  get defaultErrors() {
    return {}
  }

  get phantom() {
    return this.hasChanged("id")
  }

  get process() {
    return this[processSymbol]
  }

  get processType() {
    return this[processTypeSymbol]
  }

  get processInfoType() {
    return this[processInfoTypeSymbol]
  }

  static async get(id, cacheable) {
    if (!id) {
      return new ProductSpecificationContentProcessModel()
    }
    const response = await api.get(
        `/product-specification/processes/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new ProductSpecificationContentProcessModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/product-specification/processes/${id}`)
  }

  async fetchReference() {
    this[processSymbol] = await ProcessModel.get(this.processId, true)
    this[processTypeSymbol] = await ProcessTypeModel.get(this.process.typeId,
        true)
    this[processInfoTypeSymbol] = await ProcessInfoTypeModel.get(
        this.processType.infoTypeId, true)
  }

  async save() {
    await api.put(`/product-specification/processes/${this.id}`, this)
  }

  async validate() {
    let constraints = {
      itemId: {
        presence: true
      }
    }
    return await this.$validate(constraints)
  }
}

export const ProductSpecificationContentProcessArray = Array.decorate(
    SavableArray,
    ValidatableArray,
    class extends FetchableArray {

      get url() {
        return '/product-specification/contents/${contentId}/processes?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return ProductSpecificationContentProcessModel
      }

      initialize(content) {
        super.initialize()
        this.content = content
      }

      async fetch() {
        await super.fetch({
          contentId: this.content.id
        })
        await Promise.all(
            this.map(async (element) => await element.fetchReference()))
      }
    }
)