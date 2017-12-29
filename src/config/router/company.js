import {load, wrapModal} from './default';

let meta = {
  title: '회사 관리',
  auth: true,
  frame: true
};

export default {
  path: '/company',
  component: load('company/CompanyList'),
  meta,
  children: [{
    path: 'create',
    component: wrapModal(load('company/CompanyForm'), {
      onModalClose() {
        this.$router.push({path: '/company', query: this.$route.query});
      }
    }),
    meta,
    props: {
      action: 'create',
      closable: true
    }
  }, {
    path: 'show/:id',
    component: wrapModal(load('company/CompanyForm'), {
      onModalClose() {
        this.$router.push({path: '/company', query: this.$route.query});
      }
    }),
    meta,
    props: (route) => {
      return {
        id: route.params.id,
        action: 'show',
        closable: true
      };
    }
  }]
};
