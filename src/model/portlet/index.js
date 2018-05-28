export const portlets = [{
  x: 0,
  y: 0,
  w: 2,
  h: 4,
  authorize: 'hasRole(\'QUOTATION_MANAGER\')',
  i: 'quotation/quotation-portlet',
  component: import('src/pages/quotation/quotation-portlet.vue')
}]