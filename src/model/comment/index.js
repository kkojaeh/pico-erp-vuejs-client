import { SpringPaginationArray } from 'src/model/array'
import { Model } from 'src/model/model'
import { api } from 'src/plugins/axios'

export class CommentModel extends Model {

  get defaults () {
    return {
      subjectTypeId: null,
      subjectId: null,
      comment: ''
    }
  }

  async create () {
    const response = await api.post('/comment/comments', this)
    this.assign(response.data)
  }

  async validateCreate () {
    return await this.$validate({
      comment: {
        presence: true,
        length: {minimum: 2, maximum: 200}
      }
    })
  }
}

export class CommentArray extends SpringPaginationArray {
  url = '/comment/comments?${$QS}'
  axios = api
  model = CommentModel
}