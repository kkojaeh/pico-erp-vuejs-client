import {FetchableArray, SpringPaginationArray} from 'src/model/Array';
import {FetchableModel} from 'src/model/Model';
import {api} from 'src/axios';

console.log(FetchableModel.extend);

export class UserModel extends FetchableModel {
  url = '/v1/user/users/${id}';
  axios = api;
}

/*
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
      type: 'boolean',
      default: () => true
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

const UserRoleModel = AmpersandModel.extend({
  urlRoot: '/v1/user/users/${id}/role',
  idAttribute: 'role',
  props: {
    id: {
      type: 'string'
    },
    role: {
      type: 'string'
    },
    granted: {
      type: 'boolean',
      default: true
    },
    description: {
      type: 'string'
    }
  }
});
*/

export class UserPaginationArray extends SpringPaginationArray {
  url = '/v1/user/users';
  axios = api;
  model = UserModel;
}

export class UserRoleArray extends FetchableArray {
  url = '/v1/user/users/${id}/role';
  axios = api;
};
