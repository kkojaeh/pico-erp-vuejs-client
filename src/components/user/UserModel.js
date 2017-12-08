import { SpringPaginationCollection } from 'src/model/Collection'
import AxiosSync from 'src/model/AxiosSync'
import { api } from 'src/axios'
import AmpersandModel from 'ampersand-model'

var UserModel = AmpersandModel.extend({
  urlRoot: '/v1/user/users',
  sync: AxiosSync(api),
  props: {
    id: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    enabled: {
      type: 'boolean'
    },
    phoneNumber: {
      type: 'string'
    },
    email: {
      type: 'string'
    }
  }
})

var UserCollection = SpringPaginationCollection.extend({
  url: '/v1/user/users',
  sync: AxiosSync(api),
  model: UserModel
})

export {
  UserModel,
  UserCollection
}
