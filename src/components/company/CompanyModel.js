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
    return this.axios.post('/company/companies', this);
  }

  update() {
    return this.axios.put('/company/companies/${id}', this);
  }
}

export class CompanyPaginationArray extends SpringPaginationArray {
  url = '/company/companies';
  axios = api;
  model = CompanyModel;
}
