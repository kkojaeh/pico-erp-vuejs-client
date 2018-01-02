import {SpringPaginationArray} from 'src/model/Array';
import {exists, FetchableModel} from 'src/model/Model';
import {api} from 'src/config/axios';

export class CompanyModel extends FetchableModel {

  get defaults() {
    return {
      address: {},
      enabled: true
    };
  }

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
    return exists(this.axios, '/company/companies/${id}', this);
  }

  existsByRegistrationOrDunsNo() {
    return exists(this.axios,
        '/company/companies/${registrationOrDunsNo}?registrationOrDunsNo=true',
        this);
  }

  async validate(state) {
    let constraints = {
      id: {
        presence: true,
        length: {minimum: 3, maximum: 5},
        exists: async (value) => {
          if (!value) {
            return;
          }
          if (state !== 'create') {
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
      registrationOrDunsNo: {
        length: {minimum: 9, maximum: 20},
        exists: async (value) => {
          if (!value) {
            return;
          }
          let result = await this.existsByRegistrationOrDunsNo();
          if (result && result.id !== this.id) {
            return;
          } else {
            return !!result;
          }
        }
      },
      representative: {
        length: {minimum: 1, maximum: 20}
      },
      mobilePhoneNumber: {
        phoneNumber: true,
        length: {minimum: 2, maximum: 20}
      },
      faxNumber: {
        phoneNumber: true,
        length: {minimum: 2, maximum: 20}
      },
      telephoneNumber: {
        phoneNumber: true,
        length: {minimum: 2, maximum: 20}
      }
    };

    return await this.$validate(constraints);
  }

  async validateForCreate() {
    return await
        this.validate('create');
  }

  async validateForUpdate() {
    return await
        this.validate('update');
  }
}

export class CompanyPaginationArray extends SpringPaginationArray {
  url = '/company/companies';
  axios = api;
  model = CompanyModel;
}
