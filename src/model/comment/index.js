import {SpringPaginationArray} from 'src/model/array'
import {Model} from 'src/model/model'
import {api} from 'src/plugins/axios'
import {FetchableArray} from "../array";
import {LabelModel} from "../shared";

export class CommentModel extends Model {

  get defaults() {
    return {
      subjectTypeId: null,
      subjectId: null,
      comment: ''
    }
  }

  async save() {
    const response = await api.post('/comment/comments', this)
    this.assign(response.data)
  }

  async validate() {
    return await this.$validate({
      comment: {
        presence: true,
        length: {minimum: 2, maximum: 200}
      }
    })
  }
}

export const CommentArray = Array.decorate(
    class extends SpringPaginationArray {
      get url() {
        return '/comment/comments?${$QS}'
      }

      get axios() {
        return api
      }

      get model() {
        return CommentModel
      }
    }
)