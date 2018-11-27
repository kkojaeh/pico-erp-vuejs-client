import {wrapModal} from './default'

let itemMeta = {
  title: '품목 관리',
  authorize: 'hasAnyRole(\'ITEM_MANAGER\', \'ITEM_ACCESSOR\')'
}

let categoryMeta = {
  title: '품목 분류 관리',
  authorize: 'hasRole(\'ITEM_MANAGER\', \'ITEM_ACCESSOR\')'
}

export default [{
  name: 'item-category-list',
  path: '/item-category',
  component: () => import('src/pages/item/item-category-list.vue'),
  meta: categoryMeta,
  children: [{
    name: 'item-category-form-create',
    path: 'create',
    component: () => wrapModal(import('src/pages/item/item-category-form.vue'),
        {
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
    name: 'item-category-form-create-by-parent',
    path: 'create/:parentId',
    component: () => wrapModal(import('src/pages/item/item-category-form.vue'),
        {
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
    name: 'item-category-form-show',
    path: 'show/:id',
    component: () => wrapModal(import('src/pages/item/item-category-form.vue'),
        {
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
  name: 'item-list',
  path: '/item',
  component: () => import('src/pages/item/item-list.vue'),
  meta: itemMeta,
  children: [{
    name: 'item-form-create',
    path: 'create',
    component: () => wrapModal(import('src/pages/item/item-form'), {
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
    name: 'item-form-show',
    path: 'show/:id',
    component: () => wrapModal(import('src/pages/item/item-form.vue'), {
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
