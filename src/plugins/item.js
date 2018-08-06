import Vue from 'vue'
import ItemSelector from 'src/pages/item/item-selector.vue'
import ItemForm from 'src/pages/item/item-form.vue'
import ItemSpecEditor from 'src/pages/item/item-spec-editor.vue'

function select() {
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
          h(ItemSelector, {
            on: {
              selected: (itemModels) => finish(itemModels)
            }
          })
        ])
      }
    })
  })
}

function create(options) {
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
          this.$refs.form.create()
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
          h(ItemForm, {
            'ref': 'form',
            props: {
              action: 'create',
              'close-confirmed': true,
              closable: true,
              predefined: options.predefined
            },
            on: {
              saved: (itemModel) => finish(itemModel)
            }
          })
        ])
      }
    })
  })
}

function showSpec(id, options) {
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
          h(ItemSpecEditor, {
            'ref': 'form',
            props: {
              id: id,
              editable: options.editable || false,
              'close-confirmed': true,
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

function createSpec(options) {
  const parent = this
  return new Promise(async (resolve, reject) => {
    const node = document.createElement('div')
    document.body.appendChild(node)
    const finish = (created) => {
      resolve(created)
      vm.$destroy()
      vm.$el.remove()
    }
    const vm = new Vue({
      el: node,
      parent: parent,
      mounted() {
        this.$nextTick(() => {
          this.$refs.modal.show()
          this.$refs.form.create()
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
          h(ItemSpecEditor, {
            'ref': 'form',
            props: {
              itemId: options.itemId,
              editable: true,
              'close-confirmed': true,
              closable: true
            },
            on: {
              saved: (itemSpecModel) => finish(itemSpecModel)
            }
          })
        ])
      }
    })
  })
}

export default ({app, router, Vue}) => {
  Vue.prototype.$selectItem = select
  Vue.prototype.$createItem = create
  Vue.prototype.$showItemSpec = showSpec
  Vue.prototype.$createItemSpec = createSpec
}
