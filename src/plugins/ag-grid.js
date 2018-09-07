export default ({ app, router, Vue }) => {

  Vue.prototype.$redrawGrids = function () {
    const el = this.$el
    Array.from(el.querySelectorAll('.ag-grid-wrapper'))
      .map(grid => grid.__vue__)
      .forEach(grid => grid.api.redrawRows())

  }

}
