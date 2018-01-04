import {FetchableArray, SpringPaginationArray} from 'src/model/Array';
import {exists, FetchableModel} from 'src/model/Model';
import {api} from 'src/config/axios';

export class GroupModel extends FetchableModel {

  get defaults() {
    return {};
  }

  get axios() {
    return api;
  }

  get url() {
    return '/user/groups/${id}';
  };

  create() {
    return this.axios.post('/user/groups', this);
  }

  update() {
    return this.axios.put('/user/groups/${id}', this);
  }

  exists() {
    return exists(this.axios, '/user/groups/${id}', this);
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

export class GroupArray extends SpringPaginationArray {
  url = '/user/groups';
  axios = api;
  model = GroupModel;
};

export class GroupRoleModel extends FetchableModel {
  get axios() {
    return api;
  }

  get url() {
    return '/user/groups/${groupId}/role';
  };

  grant() {
    return this.axios.post('/user/groups/${groupId}/role', this);
  }

  revoke() {
    return this.axios.delete('/user/groups/${groupId}/role', {
      data: this
    });
  }
};

export class GroupUserModel extends FetchableModel {
  get axios() {
    return api;
  }

  get url() {
    return '/user/groups/${groupId}/user';
  };

  add() {
    return this.axios.post('/user/groups/${groupId}/user', this);
  }

  remove() {
    return this.axios.delete('/user/groups/${groupId}/user', {
      data: this
    });
  }
};

export class GroupRoleArray extends FetchableArray {
  url = '/user/groups/${id}/role';
  axios = api;
  model = GroupRoleModel;
};

export class GroupUserArray extends FetchableArray {
  url = '/user/groups/${id}/user';
  axios = api;
  model = GroupUserModel;
};
