import { FetchableArray, SpringPaginationArray } from 'src/model/array'
import { exists, FetchableModel } from 'src/model/model'
import { api } from 'src/plugins/axios'

export class BomModel extends FetchableModel {

  get defaults () {
    return {
      id: {
        itemId: null,
        revision: 1
      }
    }
  }

  get defaultErrors () {
    return {
      id: {}
    }
  }

  get axios () {
    return api
  }

  get url () {
    return '/bom/boms/${id.itemId}/${id.revision}'
  };

  create () {
    return api.post(`/bom/boms/${id.itemId}`, this)
  }

  update () {
    return this.axios.put('/bom/boms/${id.itemId}/${id.revision}', this)
  }

  exists () {
    return exists(this.axios, '/bom/boms/${id.itemId}/${id.revision}', this)
  }

  async validateForCreate () {
    return await this.$validate({
      'id.itemId': {
        presence: true
      },
      'id.revision': {
        presence: true
      }
    })
  }

  async validateForUpdate () {
    return await this.$validate({
      'id.itemId': {
        presence: true
      },
      'id.revision': {
        presence: true
      },
      processTypeId: {
        presence: true
      },
      unitCost: {
        presence: true,
        numericality: true
      }
    })
  }
}

export class BomPaginationArray extends SpringPaginationArray {
  url = '/bom/boms'
  axios = api
  model = BomModel
}