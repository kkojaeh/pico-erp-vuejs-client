import Vue from 'vue'
import Selector from 'src/pages/company/company-address-selector.vue'

export class CompanyAddressSelector {

  constructor(parent) {
    this.parent = parent
  }

  async show() {
    const parent = this.parent
    const companyId = this.companyId
    const multiple = !!this.multiple
    return new Promise(async (resolve, reject) => {
      const node = document.createElement('div')
      document.body.appendChild(node)
      const finish = (selected) => {
        resolve(selected)
        vm.$destroy()
        vm.$el.remove()
      }
      const vm = new Vue({
        el: node,
        parent: parent,
        mounted() {
          this.$nextTick(() => {
            this.$refs.modal.show()
          })
        },
        render(h) {
          return h('q-modal', {
            'ref': 'modal',
            props: {
              'content-classes': 'column'
            },
            on: {
              hide: () => finish()
            }
          }, [
            h(Selector, {
              props: {
                companyId: companyId,
                multiple: multiple
              },
              on: {
                selected: (addresses) => finish(addresses)
              }
            })
          ])
        }
      })
    })

  }

}