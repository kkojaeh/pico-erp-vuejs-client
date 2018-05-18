import { FetchableArray, SpringPaginationArray } from 'src/model/array'
import { exists, Model } from 'src/model/model'
import { api } from 'src/plugins/axios'
import { UserModel } from './user'

export class MyMenuArray extends FetchableArray {
  url = '/user/me/menus'
  axios = api
}

export class MyModel extends Model {

  static async get () {
    const response = await api.get('/user/me')
    return new MyModel(response.data)
  }

}

export class PasswordChangeModel extends Model {

  async validate (state) {
    let constraints = {
      id: {
        presence: true
      },
      confirmPassword: {
        presence: true,
        length: {minimum: 2, maximum: 20},
        equality: "newPassword"
      },
      newPassword: {
        presence: true,
        length: {minimum: 2, maximum: 20}
      },
      oldPassword: {
        presence: true,
        length: {minimum: 2, maximum: 20}
      }
    }
    return await this.$validate(constraints)
  }

  async change () {
    const response = api.put(`/user/users/${this.id}/password`, this)
    this.assign(response.data)
  }
}