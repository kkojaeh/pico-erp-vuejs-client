import {FetchableArray, SpringPaginationArray} from 'src/model/Array';
import {exists, FetchableModel} from 'src/model/Model';
import {api} from 'src/config/axios';

export class UserModel extends FetchableModel {

  get defaults() {
    return {
      enabled: true
    };
  }

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

  exists() {
    return exists(this.axios, '/user/users/${id}', this);
  }

  async validate(state) {
    let constraints = {
      id: {
        presence: true,
        length: {minimum: 2, maximum: 50},
        exists: async (value) => {
          if (!value) {
            return;
          }
          if (!state !== 'create') {
            return;
          }
          let result = await this.exists();
          return result;
        }
      },
      name: {
        presence: true,
        length: {minimum: 2, maximum: 50}
      },
      email: {
        presence: true,
        email: true,
        length: {minimum: 2, maximum: 50}
      },
      mobilePhoneNumber: {
        presence: true,
        phoneNumber: true,
        length: {minimum: 2, maximum: 50}
      }
    };
    return await this.$validate(constraints);
  }

  async validateForCreate() {
    return await this.validate('create');
  }

  async validateForUpdate() {
    return await this.validate('update');
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
