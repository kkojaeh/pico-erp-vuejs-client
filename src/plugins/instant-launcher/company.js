import Vue from 'vue'
import CompanyContactSelector
  from 'src/pages/company/company-contact-selector.vue'
import CompanyAddressSelector
  from 'src/pages/company/company-address-selector.vue'

function selectContact(companyId, options) {
  const parent = this
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
          h(CompanyContactSelector, {
            props: {
              companyId: companyId,
              multiple: !!options.multiple
            },
            on: {
              selected: (companyContacts) => finish(companyContacts)
            }
          })
        ])
      }
    })
  })
}

function selectAddress(companyId, options) {
  const parent = this
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
          h(CompanyAddressSelector, {
            props: {
              companyId: companyId,
              multiple: !!options.multiple
            },
            on: {
              selected: (companyAddresses) => finish(companyAddresses)
            }
          })
        ])
      }
    })
  })
}

export default ({app, router, Vue}) => {
  Vue.prototype.$selectCompanyContact = selectContact
  Vue.prototype.$selectCompanyAddress = selectAddress

}
