import {CollectionArray, FetchableArray} from 'src/model/array'
import {exists, Model, uuid} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {LabelModel} from 'src/model/shared'
import {language, languageAliases} from 'src/i18n'
import {ItemModel, ItemSpecModel} from "src/model/item";
import {ItemProcessArray} from '../process'

const parentSymbol = Symbol('parent')
const childrenSymbol = Symbol('children')
const itemSpecSymbol = Symbol('itemSpec')
const processesSymbol = Symbol('processes')
const itemSymbol = Symbol('item')

export class BomModel extends Model {

  get defaults() {
    return {
      estimatedAccumulatedUnitCost: {},
      estimatedIsolatedUnitCost: {},
      quantity: 1
    }
  }

  get parent() {
    return this[parentSymbol]
  }

  get children() {
    return this[childrenSymbol]
  }

  get item() {
    return this[itemSymbol]
  }

  get itemSpec() {
    return this[itemSpecSymbol]
  }

  get processes() {
    return this[processesSymbol]
  }

  get count() {
    const children = this.children
    return children.reduce((acc, child) => {
      return acc + child.count
    }, 1)
  }

  get quantityPerRoot() {
    if (this.parent) {
      return this.quantity * this.parent.quantityPerRoot
    } else {
      return this.quantity
    }
  }

  get processesNames() {
    return this.processes.map(process => process.name).join(', ')
  }

  get processable() {
    return !this.material;
  }

  get upMovable() {
    if (!this.parent) {
      return false
    }
    return this.order > 0
  }

  get downMovable() {
    if (!this.parent) {
      return false
    }
    return this.order < this.parent.children.length - 1
  }

  static async get(id, cacheable) {
    const response = await api.get(
        `/bom/boms/${id}${cacheable ? '' : '?cb=' + Date.now()}`)
    return new BomModel(response.data)
  }

  static async getByItemId(itemId, revision, cacheable) {
    revision = revision || 0
    const response = await api.get(
        `/bom/items/${itemId}/${revision}${cacheable ? '' : '?cb='
            + Date.now()}`)
    return new BomModel(response.data)
  }

  static async createByItemId(itemId) {
    const response = await api.post('/bom/boms', {
      id: uuid(),
      itemId: itemId
    })
    return new BomModel(response.data)
  }

  static async existsByItemId(itemId) {
    return await exists(api, `/bom/items/${itemId}/0`)
  }

  async fetchReference() {
    this[itemSymbol] = await ItemModel.get(this.itemId, true)
    const processArray = new ItemProcessArray()
    await processArray.fetch(this.itemId)
    this[processesSymbol] = processArray
    this[itemSpecSymbol] = await ItemSpecModel.get(this.itemSpecId, true)
  }

  async nextRevision() {
    const response = await api.post('/bom/boms', {
      id: uuid(),
      itemId: this.itemId
    })
    this.assign(response.data)
  }

  async save() {
    return await api.put(`/bom/boms/${this.id}`, this)
  }

  async determine() {
    await api.put(`/bom/boms/${this.id}/determine`,
        this)
  }

  async addMaterial(material) {
    await api.post(`/bom/boms/${this.id}/materials`, {
      bomId: this.id,
      materialId: material.id,
      quantity: material.quantity
    })
  }

  async changeMaterial(material) {
    await api.put(`/bom/boms/${this.id}/materials/${material.id}`, {
      bomId: this.id,
      materialId: material.id,
      quantity: material.quantity,
      itemSpecId: material.itemSpecId
    })
  }

  async removeMaterial(material) {
    await api.delete(
        `/bom/boms/${this.id}/materials/${material.id}`,
        {})
  }

  async changeOrder(material, order) {
    await api.put(`/bom/boms/${this.id}/materials/${material.id}/order`, {
      order: order
    })
  }

  async moveDown() {
    const parent = this.parent
    const order = this.order + 1
    const previous = parent.children.find(child => child.order == order)
    await parent.changeOrder(this, order)
    await parent.changeOrder(previous, this.order)
  }

  async moveUp() {
    const parent = this.parent
    const order = this.order - 1
    const previous = parent.children.find(child => child.order == order)
    await parent.changeOrder(this, order)
    await parent.changeOrder(previous, this.order)
  }

  isStable() {
    if (this.status == 'DETERMINED') {
      const children = this.children
      return children.filter(child => !child.isStable()).length == 0
    }
    return false
  }

  async fetchChildren(cascade, withReference) {
    if (withReference) {
      await this.fetchReference()
    }
    const children = this[childrenSymbol] = new BomChildArray()
    await children.fetch(this)
    children.forEach(child => child[parentSymbol] = this)
    if (cascade) {
      await Promise.all(
          children.map(
              async (child) => await child.fetchChildren(true, withReference))
      )
    }

  }

  async visit(visitor) {
    await visitor(this)
    const children = this.children
    if (children) {
      await Promise.all(
          children.map(async (child) => await child.visit(visitor)))
    }
  }

  async validateDetermine() {
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
          const children = this.children
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
          if (this.process && !this.process.phantom && !this.process.planned) {
            const error = languageAliases({
              ko: '작성중인 공정이 존재합니다 최소 가확정 상태가 필요합니다'
            })[language]
            errors.push(error)
          }
          return errors
        }
      }
    })
  }

  async validateNextRevision() {
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

export const BomChildArray = Array.decorate(
    CollectionArray,
    class extends FetchableArray {
      get url() {
        return '/bom/boms/${id}/materials'
      }

      get axios() {
        return api
      }

      get model() {
        return BomModel
      }
    }
)

export const BomRevisionArray = Array.decorate(
    CollectionArray,
    class extends FetchableArray {
      get url() {
        return '/bom/revisions?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return BomModel
      }

      async fetch(itemId) {
        return await super.fetch({
          itemId: itemId
        })
      }
    }
)

export const BomStatusArray = Array.decorate(
    CollectionArray,
    class extends FetchableArray {
      get url() {
        return '/bom/bom-status-labels'
      }

      get axios() {
        return api
      }

      get model() {
        return LabelModel
      }
    }
)
