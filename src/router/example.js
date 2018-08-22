let exampleMeta = {
  title: '예제',
  auth: false,
  frame: true
}

export default [{
  name: 'example-attachment',
  path: '/example/attachment',
  component: () => import('src/pages/example/attachment.vue'),
  meta: exampleMeta
}, {
  name: 'example-html-editor',
  path: '/example/html-editor',
  component: () => import('src/pages/example/html-editor.vue'),
  meta: exampleMeta
}, {
  name: 'example-gantt',
  path: '/example/gantt',
  component: () => import('src/pages/example/gantt.vue'),
  meta: exampleMeta
}]
