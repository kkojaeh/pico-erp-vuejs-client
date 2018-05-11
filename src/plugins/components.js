import Quasar, { Notify } from 'quasar'
import { language, languageAliases } from 'src/i18n'
import 'ag-grid/dist/styles/ag-grid.css'
import 'ag-grid/dist/styles/ag-theme-material.css'
// import 'ag-grid/dist/styles/ag-theme-balham.css'
import 'viewerjs/dist/viewer.min.css'


import AgGrid from 'src/components/ag-grid/ag-grid.vue'
import AgGridColumn from 'src/components/ag-grid/ag-grid-column.vue'
import ListFilterLabel from 'src/components/list/list-filter-label.vue'
import ListView from 'src/components/list/list-view.vue'
import CleaveInput from 'src/components/input/cleave-input.vue'
import PhoneNumberInput from 'src/components/input/phone-number-input.vue'
import AddressInput from 'src/components/input/address-input.vue'
import AutocompleteSelect from 'src/components/input/autocomplete-select.vue'

import DefaultAttachment from 'src/components/attachment/default-attachment.vue'
import HtmlEditor from 'src/components/html-editor/html-editor.vue'

import AgGridCheckboxRenderer
  from 'src/components/ag-grid/ag-grid-checkbox-renderer.vue'
import AgGridCheckboxEditor
  from 'src/components/ag-grid/ag-grid-checkbox-editor.vue'
import AgGridDateRenderer
  from 'src/components/ag-grid/ag-grid-date-renderer.vue'
import AgGridDatetimeRenderer
  from 'src/components/ag-grid/ag-grid-datetime-renderer.vue'
import AgGridRouterLinkRenderer
  from 'src/components/ag-grid/ag-grid-router-link-renderer.vue'
import AgGridIconRenderer
  from 'src/components/ag-grid/ag-grid-icon-renderer.vue'
import AgGridCleaveRenderer
  from 'src/components/ag-grid/ag-grid-cleave-renderer.vue'
import AgGridPhoneNumberRenderer
  from 'src/components/ag-grid/ag-grid-phone-number-renderer.vue'
import AgGridArrayLabelRenderer
  from 'src/components/ag-grid/ag-grid-array-label-renderer.vue'
import AgGridInputEditor from 'src/components/ag-grid/ag-grid-input-editor.vue'
// 현재 사용하는 지정된 나라 의 cleavejs import
// import 하는 순서에 영향을 받아 미리 import 해야함
import moment from 'moment'

import 'moment/locale/ko'
import 'cleave.js'
import 'cleave.js/dist/addons/cleave-phone.i18n.js'

const lang = language

import(`quasar-framework/i18n/${lang}`).then(data => {
  Quasar.i18n.set(data.default)
})
moment.locale(languageAliases({
  'ko': 'ko'
})[language])

// leave the export, even if you don't use it
export default ({app, router, Vue}) => {
  Vue.component('c-autocomplete-select', AutocompleteSelect)

  Vue.component('c-list-filter-label', ListFilterLabel)
  Vue.component('c-list-view', ListView)
  Vue.component('c-cleave-input', CleaveInput)
  Vue.component('c-phone-number-input', PhoneNumberInput)
  Vue.component('c-address-input', AddressInput)
  Vue.component('c-attachment', DefaultAttachment)
  Vue.component('c-html-editor', HtmlEditor)

  Vue.component('ag-grid', AgGrid)
  Vue.component('ag-grid-column', AgGridColumn)
  Vue.component('ag-grid-checkbox-renderer', AgGridCheckboxRenderer)
  Vue.component('ag-grid-date-renderer', AgGridDateRenderer)
  Vue.component('ag-grid-datetime-renderer', AgGridDatetimeRenderer)
  Vue.component('ag-grid-checkbox-editor', AgGridCheckboxEditor)
  Vue.component('ag-grid-router-link-renderer', AgGridRouterLinkRenderer)
  Vue.component('ag-grid-cleave-renderer', AgGridCleaveRenderer)
  Vue.component('ag-grid-phone-number-renderer', AgGridPhoneNumberRenderer)
  Vue.component('ag-grid-icon-renderer', AgGridIconRenderer)
  Vue.component('ag-grid-array-label-renderer', AgGridArrayLabelRenderer)
  Vue.component('ag-grid-input-editor', AgGridInputEditor)

}
