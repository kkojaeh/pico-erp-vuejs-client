import Vue from 'vue'
import PurchaseInvoiceForm
  from 'src/pages/purchase-invoice/purchase-invoice-form.vue'

function showPurchaseInvoice(id) {
  const parent = this
  return new Promise(async (resolve, reject) => {
    const node = document.createElement('div')
    document.body.appendChild(node)
    const finish = (changed) => {
      resolve(changed)
      vm.$destroy()
      vm.$el.remove()
    }
    const vm = new Vue({
      el: node,
      parent: parent,
      mounted() {
        this.$nextTick(() => {
          this.$refs.modal.show()
          this.$refs.form.show()
        })
      },
      render(h) {
        return h('q-modal', {
          'ref': 'modal',
          props: {
            'content-classes': 'column'
          },
          on: {
            hide: () => finish(false)
          }
        }, [
          h(PurchaseInvoiceForm, {
            'ref': 'form',
            props: {
              id: id,
              closable: true,
              'close-confirmed': true
            },
            on: {
              changed: () => finish(true)
            }
          })
        ])
      }
    })
  })
}

export default ({app, router, Vue}) => {
  Vue.prototype.$showPurchaseInvoice = showPurchaseInvoice
}
