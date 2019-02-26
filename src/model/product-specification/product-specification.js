import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {date} from 'quasar'
import 'json-editor'
import {language, languageAliases} from "../../i18n";

export class ProductSpecificationModel extends Model {

  constructor(data) {
    super(data)
    this.id = this.id || uuid()
  }

  get defaults() {
    return {
      itemId: null,
      contentId: null
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
      return new ProductSpecificationModel()
    }
    const response = await api.get(
        `/product-specification/specifications/${id}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new ProductSpecificationModel(response.data)
  }

  static async getByItemId(itemId, cacheable) {
    const response = await api.get(
        `/product-specification/items/${itemId}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new ProductSpecificationModel(response.data)
  }

  static async exists(id) {
    return await exists(api, `/product-specification/specifications/${id}`)
  }

  static async existsByItemId(itemId) {
    return await exists(api, `/product-specification/items/${itemId}`)
  }

  static async draft(itemId) {
    const id = uuid()
    const response = await api.post(
        `/product-specification/specifications`, {
          id: id,
          itemId: itemId
        })
    return new ProductSpecificationModel(response.data)
  }

  async save() {
    if (this.phantom) {
      const response = await api.post('/product-specification/specifications',
          this)
      this.assign(response.data)
    } else {
      await api.put(`/product-specification/specifications/${this.id}`, this)
    }
  }

  async nextDrft() {
    await api.post(`/product-specification/specifications`, {
      id: this.id,
      itemId: this.itemId
    })
  }

  async commit() {
    await api.put(`/product-specification/specifications/${this.id}/commit`,
        this)
  }

  async validateCommit() {
    let constraints = {
      commit: {
        'function': () => {
          const errors = []
          if (!this.committable) {
            const error = languageAliases({
              ko: '제출 할 수 없습니다'
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
      itemId: {
        presence: true
      }
    }
    return await this.$validate(constraints)
  }
}