import {SpringPaginationArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {date} from 'quasar'

export class ProductSpecificationContentModel extends Model {

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

  static async get(id, cacheable) {
    if (!id) {
      return new ProductSpecificationContentModel()
    }
    const response = await api.get(
        `/product-specification/contents/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new ProductSpecificationContentModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/product-specification/contents/${id}`)
  }

  async save() {
    await api.put(`/product-specification/contents/${this.id}`, this)
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

export const ProductSpecificationContentPaginationArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/product-specification/specifications/${specificationId}/contents?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return ProductSpecificationContentModel
      }
    }
)