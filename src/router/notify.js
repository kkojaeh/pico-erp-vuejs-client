import {wrapModal} from './default'

let meta = {
  title: '알림 관리',
  authorize: 'hasRole(\'NOTIFY_MANAGER\')'
}

export default [{
  name: 'notify-type-list',
  path: '/notify-type',
  component: () => import('src/pages/notify/notify-type-list.vue'),
  meta,
  children: [{
    name: 'notify-type-show',
    path: ':id',
    component: () => wrapModal(import('src/pages/notify/notify-type-form.vue'),
        {}, {
          mounted() {
            this.$on('hide', () => {
              this.$router.push(
                  {path: '/notify-type', query: this.$route.query})
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
