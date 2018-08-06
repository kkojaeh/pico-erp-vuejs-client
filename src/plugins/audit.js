import Vue from 'vue'
import AuditViewer from 'src/pages/audit/audit-viewer.vue'

function show(url) {
  const parent = this
  return new Promise(async (resolve, reject) => {
    const node = document.createElement('div')
    document.body.appendChild(node)
    const finish = () => {
      resolve()
      vm.$destroy()
      vm.$el.remove()
    }
    const vm = new Vue({
      el: node,
      parent: parent,
      mounted() {
        this.$nextTick(() => {
          this.$refs.modal.show()
          this.$refs.viewer.load()
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
          h(AuditViewer, {
            'ref': 'viewer',
            props: {
              url: url
            }
          })
        ])
      }
    })
  })
}

export default ({app, router, Vue}) => {
  Vue.prototype.$showAudit = show
}
