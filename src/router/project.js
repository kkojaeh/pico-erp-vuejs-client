import {wrapModal} from './default'

let meta = {
  title: '프로젝트 관리',
  authorize: 'hasRole(\'PROJECT_MANAGER\')'
}

export default [{
  name: 'project-list',
  path: '/project',
  component: () => import('src/pages/project/project-list.vue'),
  meta,
  children: [{
    name: 'project-form-create',
    path: 'create',
    component: () => wrapModal(import('src/pages/project/project-form.vue'), {
      onModalHide () {
        this.$router.push({path: '/project', query: this.$route.query})
      }
    }),
    meta,
    props: {
      action: 'create',
      closable: true
    }
  }, {
    name: 'project-form-show',
    path: 'show/:id',
    component: () => wrapModal(import('src/pages/project/project-form.vue'), {
      onModalHide () {
        this.$router.push({path: '/project', query: this.$route.query})
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
