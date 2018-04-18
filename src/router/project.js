import { wrapModal } from './default'

let meta = {
  title: '프로젝트 관리',
  authorize: 'hasRole(\'PROJECT_MANAGER\')'
}

export default [{
  path: '/project',
  component: () => import('pages/project/project-list'),
  meta,
  children: [{
    path: 'create',
    component: () => wrapModal(import('pages/project/project-form'), {
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
    path: 'show/:id',
    component: () => wrapModal(import('pages/project/project-form'), {
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
