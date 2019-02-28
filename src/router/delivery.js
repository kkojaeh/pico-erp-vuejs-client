import {wrapModal} from './default'

let meta = {
  title: '전송 관리',
  authorize: 'hasRole(\'DELIVERY_MANAGER\')'
}

export default [{
  name: 'delivery-subject-list',
  path: '/delivery-subject',
  component: () => import('src/pages/delivery/delivery-subject-list.vue'),
  meta,
  children: [{
    name: 'delivery-subject-show',
    path: ':id',
    component: () => wrapModal(
        import('src/pages/delivery/delivery-subject-form.vue'),
        {}, {
          mounted() {
            this.$on('hide', () => {
              this.$router.push(
                  {path: '/delivery-subject', query: this.$route.query})
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
