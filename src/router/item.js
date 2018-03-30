import { wrapModal } from './default'

let itemMeta = {
  title: '품목 관리',
  authorize: 'hasRole(\'ITEM_MANAGER\')'
}

let categoryMeta = {
  title: '품목 분류 관리',
  authorize: 'hasRole(\'ITEM_MANAGER\')'
}

export default [{
  path: '/item-category',
  component: () => import('pages/item/item-category-list'),
  meta: categoryMeta,
  children: [{
    path: 'create',
    component: () => wrapModal(import('pages/item/item-category-form'), {
      onModalHide () {
        this.$router.push({path: '/item-category', query: this.$route.query})
      }
    }),
    meta: categoryMeta,
    props: {
      parentId: null,
      action: 'create',
      closable: true
    }
  }, {
    path: 'create/:parentId',
    component: () => wrapModal(import('pages/item/item-category-form'), {
      onModalHide () {
        this.$router.push({path: '/item-category', query: this.$route.query})
      }
    }),
    meta: categoryMeta,
    props: (route) => {
      return {
        parentId: route.params.parentId,
        action: 'create',
        closable: true
      }
    }
  }, {
    path: 'show/:id',
    component: () => wrapModal(import('pages/item/item-category-form'), {
      onModalHide () {
        this.$router.push({path: '/item-category', query: this.$route.query})
      }
    }),
    meta: categoryMeta,
    props: (route) => {
      return {
        id: route.params.id,
        action: 'show',
        closable: true
      }
    }
  }]
}, {
  path: '/item',
  component: () => import('pages/item/item-list'),
  meta: itemMeta,
  children: [{
    path: 'create',
    component: () => wrapModal(import('pages/item/item-form'), {
      onModalHide () {
        this.$router.push({path: '/item', query: this.$route.query})
      }
    }),
    meta: itemMeta,
    props: {
      action: 'create',
      closable: true
    }
  }, {
    path: 'show/:id',
    component: () => wrapModal(import('pages/item/item-form'), {
      onModalHide () {
        this.$router.push({path: '/item', query: this.$route.query})
      }
    }),
    meta: itemMeta,
    props: (route) => {
      return {
        id: route.params.id,
        action: 'show',
        closable: true
      }
    }
  }]
}]
