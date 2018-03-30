let exampleMeta = {
  title: '예제',
  auth: false,
  frame: true
}

export default [{
  path: '/example/attachment',
  component: () => import('pages/example/attachment'),
  meta: exampleMeta
}, {
  path: '/example/html-editor',
  component: () => import('pages/example/html-editor'),
  meta: exampleMeta
}]
