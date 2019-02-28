import {wrapModal} from './default'

let invoiceList = {
  title: '고객 입고 송장 현황',
  authorize: 'hasAnyRole(\'OUTSOURCED_INVOICE_PUBLISHER\', \'OUTSOURCED_INVOICE_MANAGER\')'
}

let invoiceForm = {
  title: '고객 입고 송장 내용',
  authorize: 'hasAnyRole(\'OUTSOURCED_INVOICE_PUBLISHER\', \'OUTSOURCED_INVOICE_MANAGER\')'
}

export default [{
  name: 'outsourced-invoice-list',
  path: '/outsourced-invoice',
  component: () => import('src/pages/outsourced-invoice/outsourced-invoice-list.vue'),
  meta: invoiceList,
  children: [{
    name: 'outsourced-invoice-form-create',
    path: 'create',
    component: () => wrapModal(
        import('src/pages/outsourced-invoice/outsourced-invoice-form.vue'), {},
        {
          mounted() {
            this.$on('hide', () => {
              this.$router.push(
                  {path: '/outsourced-invoice', query: this.$route.query})
            })
          }
        }),
    meta: invoiceForm,
    props: (route) => {
      return {
        action: 'create',
        closable: true
      }
    }
  }, {
    name: 'outsourced-invoice-form-show',
    path: 'show/:id',
    component: () => wrapModal(
        import('src/pages/outsourced-invoice/outsourced-invoice-form.vue'), {},
        {
          mounted() {
            this.$on('hide', () => {
              this.$router.push(
                  {path: '/outsourced-invoice', query: this.$route.query})
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
