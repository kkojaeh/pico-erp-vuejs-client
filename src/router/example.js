let exampleMeta = {
  title: '예제',
  auth: false,
  frame: true
}

export default [{
  name: 'example-attachment',
  path: '/example/attachment',
  component: () => import('pages/example/attachment'),
  meta: exampleMeta
}, {
  name: 'example-html-editor',
  path: '/example/html-editor',
  component: () => import('pages/example/html-editor'),
  meta: exampleMeta
}]
