import {wrapModal} from './default'

let meta = {
  title: '설비 관리',
  authorize: 'hasAnyRole(\'FACILITY_MANAGER\', \'FACILITY_ACCESSOR\')'
}

export default [{
  name: 'facility-list',
  path: '/facility',
  component: () => import('src/pages/facility/facility-list.vue'),
  meta,
  props: (route) => {
    return {}
  },
  children: [{
    name: 'facility-form-create',
    path: 'create',
    component: () => wrapModal(import('src/pages/facility/facility-form.vue'),
        {}, {
          mounted() {
            this.$on('hide', () => {
              this.$router.push({path: '/facility', query: this.$route.query})
            })
      }
    }),
    meta,
    props: (route) => {
      return {
        action: 'create',
        closable: true
      }
    }
  }, {
    name: 'facility-form-show',
    path: 'show/:id',
    component: () => wrapModal(import('src/pages/facility/facility-form.vue'),
        {}, {
          mounted() {
            this.$on('hide', () => {
              this.$router.push({path: '/facility', query: this.$route.query})
            })
      }
    }),
    meta,
    props: (route) => {
      return {
        id: route.params.id,
        action: 'show',
        closable: true
      }
    }
  }]
}]