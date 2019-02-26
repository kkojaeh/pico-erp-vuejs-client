import {wrapModal} from './default'

let meta = {
  title: '문서 관리',
  authorize: 'hasRole(\'DOCUMENT_MANAGER\')'
}

export default [{
  name: 'document-subject-list',
  path: '/document-subject',
  component: () => import('src/pages/document/document-subject-list.vue'),
  meta,
  children: [{
    name: 'document-subject-show',
    path: ':id',
    component: () => wrapModal(
        import('src/pages/document/document-subject-form.vue'),
        {}, {
          mounted() {
            this.$on('hide', () => {
              this.$router.push(
                  {path: '/document-subject', query: this.$route.query})
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
