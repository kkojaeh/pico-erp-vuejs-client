import { FetchableArray, SpringPaginationArray } from 'src/model/array'
import { exists, FetchableModel, uuid } from 'src/model/model'
import { api } from 'src/plugins/axios'
import { language, languageAliases } from 'src/i18n'

export class ItemCategoryModel extends FetchableModel {

  constructor (data) {
   super(data);
   if(data && data.children){
     data.children = data.children.map(child => new ItemCategoryModel(child))
   }
  }

  get defaults () {
    return {
    }
  }

  get axios () {
    return api
  }

  get url () {
    return '/item/categories/${id}'
  };

  create () {
    this.id = uuid()
    return this.axios.post('/item/categories', this)
  }

  update () {
    return this.axios.put('/item/categories/${id}', this)
  }

  exists () {
    return exists(this.axios, '/item/categories/${id}', this)
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

  export class ItemCategoryHierarchyArray extends FetchableArray {
  url = '/item/categories'
  axios = api
  model = ItemCategoryModel
}

export class ItemCategoryLabelArray extends FetchableArray {
  url = '/item/category-query-labels'
  axios = api

  query = (keyword) => {
    return this.fetch({
      query: keyword
    })
  }
}


