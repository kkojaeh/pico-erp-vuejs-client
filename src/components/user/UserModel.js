import {FetchableArray, SpringPaginationArray} from 'src/model/Array';
import {FetchableModel} from 'src/model/Model';
import {api} from 'src/config/axios';
// import {required, minLength, maxLength} from 'vuelidate/lib/validators';

export class UserModel extends FetchableModel {
  get axios() {
    return api;
  }

  get url() {
    return '/user/users/${id}';
  };

  create() {
    return this.axios.post('/user/users', this);
  }

  update() {
    return this.axios.put('/user/users/${id}', this);
  }
}

export class UserRoleModel extends FetchableModel {
  get axios() {
    return api;
  }

  get url() {
    return '/user/users/${id}/role';
  };

  grant() {
    return this.axios.post('/user/users/${id}/role', this);
  }

  revoke() {
    return this.axios.delete('/user/users/${id}/role', {
      data: this
    });
  }
}

export class UserPaginationArray extends SpringPaginationArray {
  url = '/user/users';
  axios = api;
  model = UserModel;
}

export class UserRoleArray extends FetchableArray {
  url = '/user/users/${id}/role';
  axios = api;
  model = UserRoleModel;
};
