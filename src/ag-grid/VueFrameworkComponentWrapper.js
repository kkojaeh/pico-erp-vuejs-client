import {VueComponentFactory} from './VueComponentFactory';

class VueFrameworkComponentWrapper {
  constructor(parent) {
    this._parent = parent;
  }

  wrap(component, methodList, optionalMethods) {
    let componentType = VueComponentFactory.getComponentType(this._parent,
        component);
    if (!componentType) {
      return;
    }

    class DynamicComponent {
      init(params) {
        this.component = VueComponentFactory.createAndMountComponent(params,
            componentType);
      }

      getGui() {
        return this.component.$el;
      }

      destroy() {
        this.component.$destroy();
      }

      getFrameworkComponentInstance() {
        return this.component;
      }
    }

    let wrapper = new DynamicComponent();
    methodList.forEach((methodName) => {
      wrapper[methodName] = () => {
        if (wrapper.getFrameworkComponentInstance()[methodName]) {
          const componentRef = this.getFrameworkComponentInstance();
          return wrapper.getFrameworkComponentInstance()[methodName].apply(
              componentRef, arguments); // eslint-disable-line
        } else {
          console.warn('ag-Grid: missing the method ' + methodName + '()');
          return null;
        }
      };
    });
    optionalMethods.forEach((methodName) => {
      wrapper[methodName] = () => {
        if (wrapper.getFrameworkComponentInstance()[methodName]) {
          const componentRef = this.getFrameworkComponentInstance();
          return wrapper.getFrameworkComponentInstance()[methodName].apply(
              componentRef, arguments); // eslint-disable-line
        }
      };
    });

    return wrapper;
  }
}

VueFrameworkComponentWrapper.prototype.__agBeanMetaData = {
  beanName: 'frameworkComponentWrapper'
};

export {VueFrameworkComponentWrapper};
