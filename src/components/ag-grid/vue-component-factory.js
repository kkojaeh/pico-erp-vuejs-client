import Vue from 'vue'
import * as _ from 'lodash'

export class VueComponentFactory {
  constructor ($el, parent) {
    this.$el = $el
    this.parent = parent
  }

  static getComponentType (parent, component) {
    if (typeof component === 'string') {
      const another = _.upperFirst(_.camelCase(component))
      while (parent) {
        const components = parent.$options.components
        const componentInstance = components[component] || components[another]
        if (componentInstance) {
          return Vue.extend(componentInstance)
        } else {
          parent = parent.$parent
        }
      }
      console.error(
        `Could not find component with name of ${component}. Is it in Vue.components?`)
      return null
    } else {
      // assume a type
      return component
    }
  }

  static createAndMountComponent (parent, params, ComponentType) {
    let details = {
      parent: parent,
      data: {
        params: params
      }
    }
    let component = new ComponentType(details)

    component.$mount()
    return component
  }

  createRendererFromComponent (component) {
    let componentType = VueComponentFactory.getComponentType(this.parent,
      component)
    if (!componentType) {
      return
    }

    class CellRendererComponent {
      init (params) {
        this.component = VueComponentFactory.createAndMountComponent(
          this.parent, params,
          componentType)
      }

      getGui () {
        return this.component.$el
      }

      destroy () {
        this.component.$destroy()
      }
    }

    return CellRendererComponent
  }

  createEditorFromComponent (component) {
    let componentType = VueComponentFactory.getComponentType(this.parent,
      component)
    if (!componentType) {
      return
    }

    class CellEditor {
      init (params) {
        this.component = VueComponentFactory.createAndMountComponent(
          this.parent, params,
          componentType)
      }

      getValue () {
        return this.component.getValue()
      }

      getGui () {
        return this.component.$el
      }

      destroy () {
        this.component.$destroy()
      }

      isPopup () {
        return this.component.isPopup ? this.component.isPopup() : false
      }

      isCancelBeforeStart () {
        return this.component.isCancelBeforeStart
          ? this.component.isCancelBeforeStart() : false
      }

      isCancelAfterEnd () {
        return this.component.isCancelAfterEnd
          ? this.component.isCancelAfterEnd() : false
      }

      focusIn () {
        if (this.component.focusIn) {
          this.component.focusIn()
        }
      }

      focusOut () {
        if (this.component.focusOut) {
          this.component.focusOut()
        }
      }
    }

    return CellEditor
  }

  createFilterFromComponent (component) {
    let componentType = VueComponentFactory.getComponentType(this.parent,
      component)
    if (!componentType) {
      return
    }

    class Filter {
      init (params) {
        this.component = VueComponentFactory.createAndMountComponent(
          this.parent, params,
          componentType)
      }

      getGui () {
        return this.component.$el
      }

      destroy () {
        this.component.$destroy()
      }

      isFilterActive () {
        return this.component.isFilterActive()
      }

      doesFilterPass (params) {
        return this.component.doesFilterPass(params)
      }

      getModel () {
        return this.component.getModel()
      }

      setModel (model) {
        this.component.setModel(model)
      }

      afterGuiAttached (params) {
        if (this.component.afterGuiAttached) {
          this.component.afterGuiAttached(params)
        }
      }

      getFrameworkComponentInstance () {
        return this.component
      }
    }

    return Filter
  }
}
