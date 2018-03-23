import { FetchableArray, SpringPaginationArray } from 'src/model/array'
import { exists, FetchableModel } from 'src/model/model'
import { api } from 'src/plugins/axios'

export class CommentModel extends FetchableModel {

  get defaults () {
    return {
      subjectTypeId: null,
      subjectId: null,
      comment: ''
    }
  }

  get axios () {
    return api
  }

  create () {
    return this.axios.post('/comment/comments', this)
  }

  async validate (state) {
    let constraints = {
      comment: {
        presence: true,
        length: {minimum: 2, maximum: 200}
      }
    }

    return await this.$validate(constraints)
  }

  async validateForCreate () {
    return await
      this.validate('create')
  }
}

export class CommentArray extends SpringPaginationArray {
  url = '/comment/comments'
  axios = api
  model = CommentModel
}