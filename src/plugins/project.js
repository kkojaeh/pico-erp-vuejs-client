import Vue from 'vue'
import ProjectSelector from 'src/pages/project/project-selector.vue'

function select(options) {
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
          h(ProjectSelector, {
            props: {
              multiple: !!options.multiple
            },
            on: {
              selected: (projectModels) => finish(projectModels)
            }
          })
        ])
      }
    })
  })
}

export default ({app, router, Vue}) => {
  Vue.prototype.$selectProject = select
}
