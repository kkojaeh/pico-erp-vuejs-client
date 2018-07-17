import { wrapModal } from './default'

let meta = {
  title: 'BOM 관리',
  authorize: 'hasAnyRole(\'BOM_MANAGER\', \'BOM_ACCESSOR\')'
}

export default [{
  name: 'bom-revision-list',
  path: '/bom/:itemId',
  component: () => import('pages/bom/bom-revision-list'),
  meta,
  props: (route) => {
    return {
      itemId: route.params.itemId
    }
  },
  children: [{
    name: 'bom-form',
    path: ':id',
    component: () => wrapModal(import('pages/bom/bom-form'), {
      onModalHide () {
        const itemId = this.$route.params.itemId
        this.$router.push(`/bom/${itemId}`)
      }
    }),
    meta,
    props: (route) => {
      return {
        bomId: route.params.id,
        closable: true
      }
    }
  }]
}]

/*
export default [{
  path: '/bom',
  component: () => import('pages/bom/bom-list'),
  meta,
  children: [{
    path: 'create',
    component: () => wrapModal(import('pages/bom/bom-form'), {
      onModalHide () {
        this.$router.push({path: '/bom', query: this.$route.query})
      }
    }),
    meta,
    props: {
      action: 'create',
      closable: true
    }
  }, {
    path: 'show/:id',
    component: () => wrapModal(import('pages/bom/bom-form'), {
      onModalHide () {
        this.$router.push({path: '/bom', query: this.$route.query})
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

*/