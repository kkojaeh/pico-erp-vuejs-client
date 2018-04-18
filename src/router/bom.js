let meta = {
  title: 'BOM 관리',
  authorize: 'hasAnyRole(\'BOM_MANAGER\', \'BOM_ACCESSOR\')'
}

export default [{
  path: '/bom/revision/:itemId',
  component: () => import('pages/bom/bom-revision-list'),
  meta,
  props: (route) => {
    return {
      itemId: route.params.itemId
    }
  }
}, {
  path: '/bom/show/:itemId/:revision',
  component: () => import('pages/bom/bom-form'),
  meta,
  props: (route) => {
    return {
      itemId: route.params.itemId,
      revision: Number(route.params.revision),
      action: 'show'
    }
  }
}, {
  path: '/bom/show/:id',
  component: () => import('pages/bom/bom-form'),
  meta,
  props: (route) => {
    return {
      id: route.params.id,
      action: 'show'
    }
  }
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