let meta = {
  title: '창고 장소 관리',
  authorize: 'hasAnyRole(\'WAREHOUSE_MANAGER\')'
}

export default [{
  name: 'warehouse-location-form',
  path: '/warehouse-location',
  component: () => import('src/pages/warehouse/location-form'),
  meta,
  props: (route) => {
    return {}
  }
}]

/*
export default [{
  path: '/bom',
  component: () => import('src/pages/bom/bom-list'),
  meta,
  children: [{
    path: 'create',
    component: () => wrapModal(import('src/pages/bom/bom-form'), {
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
    component: () => wrapModal(import('src/pages/bom/bom-form'), {
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