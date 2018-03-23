import {SpringPaginationArray, FetchableArray} from 'src/model/array';
import {exists, FetchableModel} from 'src/model/model';
import {api} from 'src/plugins/axios';

export class QuotationModel extends FetchableModel {

  get defaults() {
    return {
      address: {},
      enabled: true,
      supplier: false,
      customer: false,
      outsourcing: false
    };
  }

  get axios() {
    return api;
  }

  get url() {
    return '/quotation/quotations/${id}';
  };

  create() {
    return this.axios.post('/quotation/quotations', this);
  }

  update() {
    return this.axios.put('/quotation/quotations/${id}', this);
  }

  exists() {
    return exists(this.axios, '/quotation/quotations/${id}', this);
  }

  async validate(state) {
    let constraints = {
      id: {
        presence: true,
        length: {minimum: 3, maximum: 5},
        format: {
          pattern: '[A-Z0-9]{3,5}',
          message: ({
            ko: '형식이 틀립니다(영문 대문자/숫자 조합 3~5 글자입니다)'
          })[navigator.language]
        },
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
      registrationNumber: {
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

export class QuotationPaginationArray extends SpringPaginationArray {
  url = '/quotation/quotations';
  axios = api;
  model = QuotationModel;
}

export class QuotationSatausArray extends FetchableArray {
  url = '/quotation/status-labels';
  axios = api;
}

export class QuotationExpiryPolicyArray extends FetchableArray {
  url = '/quotation/expiry-policy-labels';
  axios = api;
}
