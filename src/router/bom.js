import {wrapModal} from './default'

let meta = {
  title: 'BOM 관리',
  authorize: 'hasAnyRole(\'BOM_MANAGER\', \'BOM_ACCESSOR\')'
}

export default [{
  name: 'bom-revision-list',
  path: '/bom/:itemId',
  component: () => import('src/pages/bom/bom-revision-list.vue'),
  meta,
  props: (route) => {
    return {
      itemId: route.params.itemId
    }
  },
  children: [{
    name: 'bom-form',
    path: ':id',
    component: () => wrapModal(import('src/pages/bom/bom-form.vue'), {}, {
      mounted() {
        this.$on('hide', () => {
          const itemId = this.$route.params.itemId
          this.$router.push(`/bom/${itemId}`)
        })
      }
    }),
    meta,
    props: (route) => {
      return {
        id: route.params.id,
        closable: true
      }
    }
  }]
}]