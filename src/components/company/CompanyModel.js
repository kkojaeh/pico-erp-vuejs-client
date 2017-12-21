import {SpringPaginationArray} from 'src/model/Array';
import {FetchableModel} from 'src/model/Model';
import {api} from 'src/config/axios';

export class CompanyModel extends FetchableModel {
  get axios() {
    return api;
  }

  get url() {
    return '/company/companies/${id}';
  };

  create() {
    return this.axios.post('/user/users', this);
  }

  update() {
    return this.axios.put('/user/users/${id}', this);
  }
}

export class CompanyPaginationArray extends SpringPaginationArray {
  url = '/user/users';
  axios = api;
  model = CompanyModel;
}
