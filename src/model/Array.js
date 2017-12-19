import * as _ from 'lodash';
import qs from 'qs';

/* eslint-disable */

export class FetchableArray extends Array {
  axios = null;
  url = null;
  model = null;

  fetch = (data) => {
    return new Promise((resolve, reject) => {
      this.axios.get(this.resolveUrl(this.url, data), {data: data}).then(
          (response) => {
            let parsed = this.parse(response);
            if (this.model) {
              parsed = parsed.map((o) => new this.model(o));
            }
            this.splice.apply(this, [0, this.length].concat(parsed));
            resolve(parsed);
          }).catch((error) => {
        reject(error);
      });
    });
  };

  resolveUrl = (url, data) => {
    return _.template(url)(data) + (_.includes(url, '?') ? '&' : '?')
        + qs.stringify(data);
  };

  parse = (response) => {
    return response.data;
  };
}

export class PaginationArray extends FetchableArray {
  total = 0;
  size = 20;
  page = 1;
  sorters = null;
}

export class SpringPaginationArray extends PaginationArray {
  resolveUrl = (url, data) => {
    _.keys(data).forEach((key) => {
      let value = data[key];
      if (value === '' || value === undefined || value === null) {
        delete data[key];
      }
    });
    let query = {
      size: this.size,
      page: this.page - 1
    };
    _.assign(query, data);
    if (this.sorters) {
      query.sort = this.sorters.map(
          (s) => s.getField() + ',' + s.getDir().toLowerCase());
    }
    // array 를 query string 으로 생성시 옵션을 반복으로 사용
    return url + (_.includes(url, '?') ? '&' : '?') + qs.stringify(
        query, {arrayFormat: 'repeat'});
  };

  parse = (response) => {
    if (response) {
      let data = response.data;
      this.total = data.totalElements;
      this.size = data.size;
      this.page = data.number + 1;
      return data.content;
    }
  };
}

/* eslint-enable */
