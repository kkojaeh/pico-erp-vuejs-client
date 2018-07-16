export default ({ app, router, Vue }) => {

  Vue.prototype.$redrawGrids = function () {
    const el = this.$el
    const grids = el.querySelectorAll('.ag-grid-wrapper')
    Array.from(grids)
      .map(grid => grid.__vue__)
      .forEach(grid => grid.api.redrawRows())

  }

}
