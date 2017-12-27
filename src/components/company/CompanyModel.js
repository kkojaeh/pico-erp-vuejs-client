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

  exists() {
    return new Promise((resolve, reject) => {
      this.axios.get('/company/companies/${id}', {
        data: this,
        preventDefault: true
      })
      .then((data) => {
        resolve(true, data);
      })
      .catch((e) => {
        if (e.response.status == 404) {
          resolve(false);
        } else {
          e.resumePreventDefault();
          reject(e);
        }
      });
    });
  }

  existsByRegistrationOrDunsNo() {
    return new Promise((resolve, reject) => {
      this.axios.get('/company/companies/${registrationOrDunsNo}?registrationOrDunsNo=true', {
        data: this,
        preventDefault: true
      })
      .then((data) => {
        resolve(true, data);
      })
      .catch((e) => {
        if (e.response.status == 404) {
          resolve(false);
        } else {
          e.resumePreventDefault();
          reject(e);
        }
      });
    });
  }
}

export class CompanyPaginationArray extends SpringPaginationArray {
  url = '/company/companies';
  axios = api;
  model = CompanyModel;
}
