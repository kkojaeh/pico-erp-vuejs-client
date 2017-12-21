import {SpringPaginationArray} from 'src/model/Array';
import {FetchableModel} from 'src/model/Model';
import {api} from 'src/config/axios';

export class CompanyModel extends FetchableModel {
  get axios() {
    return api;
  }

  get url() {
    return '/v1/user/users/${id}';
  };

  create() {
    return this.axios.post('/v1/user/users', this);
  }

  update() {
    return this.axios.put('/v1/user/users/${id}', this);
  }
}

export class CompanyPaginationArray extends SpringPaginationArray {
  url = '/v1/user/users';
  axios = api;
  model = CompanyModel;
}
