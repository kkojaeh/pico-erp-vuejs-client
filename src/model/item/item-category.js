import {FetchableArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {language, languageAliases} from 'src/i18n'
import {LabelModel} from 'src/model/shared'

export class ItemCategoryModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {}
  }

  static async get(id, cacheable) {
    if (!id) {
      return new ItemCategoryModel()
    }
    const response = await api.get(
        `/item/categories/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new ItemCategoryModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/item/categories/${id}`)
  }

  get phantom() {
    return this.hasChanged("id")
  }

  async save() {
    if(this.phantom) {
      const response = await api.post('/item/categories', this)
      this.assign(response.data)
    }else{
      await api.put(`/item/categories/${this.id}`, this)
    }
  }

  async validate() {
    let constraints = {
      name: {
        presence: true,
        format: {
          pattern: '[^<^>^:^"^/^\\^|^?^*]+',
          message: languageAliases({
            ko: '형식이 틀립니다( `<>:"/\\|?*` 이와 같은 문자는 사용할 수 없습니다)'
          })[language]
        },
        length: {minimum: 2, maximum: 50}
      },
      description: {
        presence: false,
        length: {maximum: 200}
      }
    }

    return await this.$validate(constraints)
  }

}

export const ItemCategoryHierarchyArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/item/categories'
      }

      get axios() {
        return api
      }

      get model() {
        return ItemCategoryModel
      }
    }
)

export const ItemCategoryLabelArray = Array.decorate(
    class extends FetchableArray {
      get url() {
        return '/item/category-query-labels?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }

      async query(keyword) {
        return await this.fetch({
          query: keyword || ''
        })
      }
    }
)