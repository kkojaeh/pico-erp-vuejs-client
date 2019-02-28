import {wrapModal} from './default'

let invoiceList = {
  title: '입고 송장 현황',
  authorize: 'hasAnyRole(\'INVOICE_RECEIVER\', \'INVOICE_MANAGER\')'
}

let invoiceForm = {
  title: '입고 송장 내용',
  authorize: 'hasAnyRole(\'INVOICE_RECEIVER\', \'INVOICE_MANAGER\')'
}

export default [{
  name: 'invoice-list',
  path: '/invoice',
  component: () => import('src/pages/invoice/invoice-list.vue'),
  meta: invoiceList,
  children: [{
    name: 'invoice-form-show',
    path: 'show/:id',
    component: () => wrapModal(
        import('src/pages/invoice/invoice-form.vue'), {}, {
          mounted() {
            this.$on('hide', () => {
              this.$router.push({path: '/invoice', query: this.$route.query})
            })
          }
        }),
    meta: invoiceForm,
    props: (route) => {
      return {
        id: route.params.id,
        action: 'show',
        closable: true
      }
    }
  }]
}]
