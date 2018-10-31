import Vue from 'vue'
import BomForm from 'src/pages/bom/bom-form.vue'

function show(id) {
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
          h(BomForm, {
            'ref': 'form',
            props: {
              id: id,
              closable: true
            },
            on: {
              saved: () => finish(true)
            }
          })
        ])
      }
    })
  })
}

export default ({app, router, Vue}) => {
  Vue.prototype.$showBom = show
}
