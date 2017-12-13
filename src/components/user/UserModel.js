import {SpringPaginationCollection} from 'src/model/Collection';
import axiosSync from 'src/model/AxiosSync';
import {api} from 'src/axios';
import AmpersandModel from 'ampersand-model';

const UserModel = AmpersandModel.extend({
  urlRoot: '/v1/user/users',
  sync: axiosSync(api),
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
    },
    createdBy: {
      type: 'object'
    },
    createdDate: {
      type: 'date'
    },
    lastModifiedBy: {
      type: 'object'
    },
    lastModifiedDate: {
      type: 'date'
    }
  }
});

const UserCollection = SpringPaginationCollection.extend({
  url: '/v1/user/users',
  sync: axiosSync(api),
  model: UserModel
});

export {
  UserModel,
  UserCollection
};
