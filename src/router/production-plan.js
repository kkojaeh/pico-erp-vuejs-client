import {wrapModal} from './default'

let planList = {
  title: '생산 계획 현황',
  authorize: 'hasAnyRole(\'PRODUCTION_PLAN_CHARGER\', \'PRODUCTION_REQUEST_MANAGER\')'
}

let planForm = {
  title: '생산 계획 내용',
  authorize: 'hasAnyRole(\'PRODUCTION_PLAN_CHARGER\', \'PRODUCTION_REQUEST_MANAGER\')'
}

export default [{
  name: 'production-plan-list',
  path: '/production-plan/plan',
  component: () => import('src/pages/production-plan/production-plan-list.vue'),
  meta: planList,
  children: [{
    name: 'production-plan-form-show',
    path: ':id',
    component: () => wrapModal(
        import('src/pages/production-plan/production-plan-form.vue'), {},
        {
          mounted() {
            this.$on('hide', () => {
              this.$router.push(
                  {
                    path: '/production-plan/plan',
                    query: this.$route.query
                  })
            })
          }
        }),
    meta: planForm,
    props: (route) => {
      return {
        id: route.params.id,
        action: 'show',
        closable: true
      }
    }
  }]
}]
