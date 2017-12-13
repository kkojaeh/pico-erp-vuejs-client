import AmpersandRestCollection from 'ampersand-rest-collection';
import * as _ from 'lodash';
import qs from 'qs';

class PaginationRestCollection extends AmpersandRestCollection.extend({
  total: 0,
  size: 20,
  page: 1,
  sorters: null
}) {
  paginate(page) {
    this.page = page;
    return this.fetch(this.lastOptions);
  }

  sort(sorters) {
    this.sorters = sorters;
    return this.fetch(this.lastOptions);
  }

  resolveUrl(baseUrl, data, page, size, sorters) {
    return baseUrl;
  }

  fetch(options) {
    options = options || {};
    options.data = options.data || {};

    // 최종 실행전 옵션을 저장(페이지 변동시 이전 조건과 동일하게 호출하기 위해)
    this.lastOptions = options;
    // 실행 옵션 url 을 변경시키기 때문에 별도로 사용
    let execOptions = {};
    _.assign(execOptions, options);
    let url = options.url || this.url;

    // 파라미터로 생성된 url 을 사용
    execOptions.url = this.resolveUrl(url, options.data, this.page, this.size,
        this.sorters);
    // url 을 변조 시키기 때문에 제거
    delete execOptions.data;

    return super.fetch(execOptions);
  }

  parse(response) {
    if (response) {
      return response;
    }
  }
}

class SpringPaginationCollection extends PaginationRestCollection {
  resolveUrl(baseUrl, data, page, size, sorters) {
    _.keys(data).forEach((key) => {
      let value = data[key];
      if (value === '' || value === undefined || value === null) {
        delete data[key];
      }
    });
    let query = {
      size: size,
      page: page - 1
    };
    _.assign(query, data);
    if (this.sorters) {
      query.sort = this.sorters.map(
          (s) => s.getField() + ',' + s.getDir().toLowerCase());
    }
    // array 를 query string 으로 생성시 옵션을 반복으로 사용
    return baseUrl + (_.includes(baseUrl, '?') ? '&' : '?') + qs.stringify(
        query, {arrayFormat: 'repeat'});
  }

  parse(response) {
    if (response) {
      this.total = response.totalElements;
      this.size = response.size;
      this.page = response.number + 1;
      return response.content;
    }
  }
}

export {
  SpringPaginationCollection
};
