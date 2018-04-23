import { FetchableArray } from 'src/model/array'
import { exists, Model, uuid } from 'src/model/model'
import { api } from 'src/plugins/axios'
import { LabelModel } from 'src/model/shared'
import { language, languageAliases } from 'src/i18n'
import { ItemModel } from 'src/model/item'

const parentSymbol = Symbol('parent')
const childrenSymbol = Symbol('children')

export class BomModel extends Model {

  get defaults () {
    return {
      estimatedUnitCost: {},
      quantity: 1
    }
  }

  static async get (id) {
    const response = await api.get(`/bom/boms/${id}`)
    return new BomModel(response.data)
  }

  static async getByItemId (itemId, revision) {
    revision = revision || 0
    const response = await api.get(`/bom/items/${itemId}/${revision}`)
    return new BomModel(response.data)
  }

  static async createByItemId (itemId) {
    const response = await api.post('/bom/boms', {
      id: uuid(),
      itemId: itemId
    })
    return new BomModel(response.data)
  }

  static async existsByItemId (itemId) {
    return await exists(api, `/bom/items/${itemId}/0`)
  }

  async nextRevision () {
    const response = await api.post('/bom/boms', {
      id: uuid(),
      itemId: this.itemId
    })
    this.assign(response.data)
  }

  async getItem () {
    this.item = await ItemModel.get(this.itemId, true)
  }

  async update () {
    return await api.put(`/bom/boms/${this.id}`, this)
  }

  async determine () {
    await api.put(`/bom/boms/${this.id}/determine`,
      this)
  }

  async addMaterial (material) {
    await api.post(`/bom/boms/${this.id}/materials`, {
      material: {
        id: material.id,
        quantity: material.quantity
      }
    })
  }

  async changeMaterial (material) {
    await api.put(
      `/bom/boms/${this.id}/materials/${material.id}`,
      {
        material: {
          id: material.id,
          quantity: material.quantity,
          itemSpecId: material.itemSpecId
        }
      })
  }

  async removeMaterial (material) {
    await api.delete(
      `/bom/boms/${this.id}/materials/${material.id}`,
      {})
  }

  getParent () {
    return this[parentSymbol]
  }

  getChildren () {
    return this[childrenSymbol]
  }

  isStable () {
    if (this.status == 'DETERMINED') {
      const children = this.getChildren()
      return children.filter(child => !child.isStable()).length == 0
    }
    return false
  }

  async fetchChildren (cascade) {
    const children = this[childrenSymbol] = new BomChildArray()

    await children.fetch(this)
    children.forEach(child => child[parentSymbol] = this)
    if (cascade) {
      await Promise.all(
        children.map(async (child) => await child.fetchChildren(true))
      )
    }
  }

  async visit (visitor) {
    await visitor(this)
    const children = this.getChildren()
    if (children) {
      await Promise.all(children.map(async (child) => await child.visit(visitor)))
    }
  }

  async validateDetermine () {
    return await this.$validate({
      'determine': {
        'function': () => {
          const errors = []
          if (this.status !== 'DRAFT') {
            const error = languageAliases({
              ko: '작성 상태가 아닙니다'
            })[language]
            errors.push(error)
          }
          const children = this.getChildren()
          let unstable = children.filter(
            child => !child.isStable()).length > 0
          if (unstable) {
            const error = languageAliases({
              ko: '확정되지 않은 재료가 존재합니다'
            })[language]
            errors.push(error)
          }
          if (this.specifiable && !this.itemSpecId) {
            const error = languageAliases({
              ko: '품목 스펙이 정의 되지 않았습니다'
            })[language]
            errors.push(error)
          }
          return errors
        }
      }
    })
  }

  async validateNextRevision () {
    return await this.$validate({
      'nextRevision': {
        'function': () => {
          const errors = []
          if (this.status !== 'DETERMINED') {
            const error = languageAliases({
              ko: '확정 상태가 아닙니다'
            })[language]
            errors.push(error)
          }
          return errors
        }
      }
    })
  }

}

export class BomChildArray extends FetchableArray {
  url = '/bom/boms/${id}/materials'
  axios = api
  model = BomModel
}

export class BomRevisionArray extends FetchableArray {
  url = '/bom/revisions?${$QS}'
  axios = api
  model = BomModel
  query = async (itemId) => {
    return await this.fetch({
      itemId: itemId
    })
  }
}

export class BomStatusArray extends FetchableArray {
  url = '/bom/bom-status-labels'
  axios = api
  model = LabelModel
}
