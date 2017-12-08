export default class AgGridPaginationCollectionMediator {

  constructor (agGrid, paginationCollection) {
    this._grid = agGrid
    this._collection = paginationCollection

    if (this._grid.gridOptions.enableServerSideSorting) {
      this._grid.$on('sort-changed', this._onGridSortChanged.bind(this))
    }
    this._grid.$on('pagination-changed', this._onGridPaginationChanged.bind(this))
  }

  _applyGrid (grid) {

  }

  _onGridSortChanged (e) {
    this._collection.sort(e.api.getSortModel().map(sm => this._collection.createSort(sm.colId, sm.sort)))
  }

  _onGridPaginationChanged (e) {
    console.log(e)
  }
}
