// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-material.css';
import 'quasar-extras/material-icons';
import 'src/themes/global.css';
import Vue from 'vue';
import Quasar, * as All from 'quasar';
import axios from './axios';
import mixin from './mixin';
import AgGrid from 'src/integration/ag-grid/AgGrid.vue';
import AgGridColumn from 'src/integration/ag-grid/AgGridColumn.vue';
import FilterChip from '@/common/FilterChip.vue';
import ListView from '@/common/ListView.vue';
import CleaveInput from '@/common/CleaveInput.vue';
import PhoneNumberInput from '@/common/PhoneNumberInput.vue';
import AddressInput from '@/common/AddressInput.vue';
import Attachment from '@/common/Attachment.vue';
import HtmlEditor from '@/common/HtmlEditor.vue';

import AgGridCheckboxRenderer from 'src/integration/ag-grid/AgGridCheckboxRenderer.vue';
import AgGridCheckboxEditor from 'src/integration/ag-grid/AgGridCheckboxEditor.vue';
import AgGridDateRenderer from 'src/integration/ag-grid/AgGridDateRenderer.vue';
import AgGridDatetimeRenderer from 'src/integration/ag-grid/AgGridDatetimeRenderer.vue';
import AgGridLinkRenderer from 'src/integration/ag-grid/AgGridLinkRenderer.vue';
import AgGridIconRenderer from 'src/integration/ag-grid/AgGridIconRenderer.vue';
import AgGridCleaveRenderer from 'src/integration/ag-grid/AgGridCleaveRenderer.vue';
import AgGridPhoneNumberRenderer from 'src/integration/ag-grid/AgGridPhoneNumberRenderer.vue';

// 현재 사용하는 지정된 나라 의 cleavejs import
// import 하는 순서에 영향을 받아 미리 import 해야함
import moment from 'moment';
import 'moment/locale/ko';
import 'cleave.js';
import 'cleave.js/dist/addons/cleave-phone.i18n.js';

// import 'quasar-extras/ionicons'
import 'quasar-extras/fontawesome';

import './validate';
// ==============================

// Uncomment the following lines if you need IE11/Edge support
// require(`quasar/dist/quasar.ie`)
// require(`quasar/dist/quasar.ie.${__THEME}.css`)
// import 'quasar-extras/animate'

export default () => {
  Vue.use(Quasar, {
    components: All,
    directives: All
  });

  Vue.use(axios);

  Vue.component('c-filter-chip', FilterChip);
  Vue.component('c-list-view', ListView);
  Vue.component('c-cleave-input', CleaveInput);
  Vue.component('c-phone-number-input', PhoneNumberInput);
  Vue.component('c-address-input', AddressInput);
  Vue.component('c-attachment', Attachment);
  Vue.component('c-html-editor', HtmlEditor);


  Vue.component('ag-grid', AgGrid);
  Vue.component('ag-grid-column', AgGridColumn);
  Vue.component('ag-grid-checkbox-renderer', AgGridCheckboxRenderer);
  Vue.component('ag-grid-date-renderer', AgGridDateRenderer);
  Vue.component('ag-grid-datetime-renderer', AgGridDatetimeRenderer);
  Vue.component('ag-grid-checkbox-editor', AgGridCheckboxEditor);
  Vue.component('ag-grid-link-renderer', AgGridLinkRenderer);
  Vue.component('ag-grid-cleave-renderer', AgGridCleaveRenderer);
  Vue.component('ag-grid-phone-number-renderer', AgGridPhoneNumberRenderer);
  Vue.component('ag-grid-icon-renderer', AgGridIconRenderer);

  Vue.config.productionTip = false;
  require(`quasar/dist/quasar.${__THEME}.css`);
  if (__THEME === 'mat') {
    require('quasar-extras/roboto-font');
  }

  Vue.mixin(mixin);
  moment.locale(navigator.language);
};
