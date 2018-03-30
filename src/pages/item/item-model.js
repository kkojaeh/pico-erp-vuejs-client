import { FetchableArray, SpringPaginationArray } from 'src/model/array'
import { exists, FetchableModel, uuid } from 'src/model/model'
import { api } from 'src/plugins/axios'
import { language, languageAliases } from 'src/i18n'

export class ItemModel extends FetchableModel {

  get defaults () {
    return {
    }
  }

  get axios () {
    return api
  }

  get url () {
    return '/item/items/${id}'
  };

  create () {
    this.id = uuid()
    return this.axios.post('/item/items', this)
  }

  update () {
    return this.axios.put('/item/items/${id}', this)
  }

  exists () {
    return exists(this.axios, '/item/items/${id}', this)
  }

  async validate (state) {
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

  async validateForCreate () {
    return await
      this.validate('create')
  }

  async validateForUpdate () {
    return await
      this.validate('update')
  }
}

  export class ItemPaginationArray extends SpringPaginationArray {
  url = '/item/items'
  axios = api
  model = ItemModel
}

export class ItemLabelArray extends FetchableArray {
  url = '/item/item-query-labels'
  axios = api

  query = (keyword) => {
    return this.fetch({
      query: keyword
    })
  }
}

export class ItemTypeArray extends FetchableArray {
  url = '/item/item-type-labels'
  axios = api
}

export class ItemStatusArray extends FetchableArray {
  url = '/item/item-status-labels'
  axios = api
}


