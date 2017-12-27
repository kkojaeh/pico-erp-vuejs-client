// === DEFAULT / CUSTOM STYLE ===
// WARNING! always comment out ONE of the two require() calls below.
// 1. use next line to activate CUSTOM STYLE (./src/themes)
// require(`./themes/app.${__THEME}.styl`)
// 2. or, use next line to activate DEFAULT QUASAR STYLE
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-material.css';
import 'quasar-extras/material-icons';
import Vue from 'vue';
import Quasar, * as All from 'quasar';
import axios from './axios';
import mixin from './mixin';
import Vuelidate from 'vuelidate';
import AgGrid from 'src/ag-grid/AgGrid.vue';
import AgGridColumn from 'src/ag-grid/AgGridColumn.vue';
import FilterChip from '@/common/FilterChip.vue';
import ListView from '@/common/ListView.vue';
import CleaveInput from '@/common/CleaveInput.vue';
import PhoneInput from '@/common/PhoneInput.vue';

import AgGridCheckboxRenderer from 'src/ag-grid/AgGridCheckboxRenderer.vue';
import AgGridCheckboxEditor from 'src/ag-grid/AgGridCheckboxEditor.vue';
import AgGridDateRenderer from 'src/ag-grid/AgGridDateRenderer.vue';
import AgGridDatetimeRenderer from 'src/ag-grid/AgGridDatetimeRenderer.vue';
import AgGridLinkRenderer from 'src/ag-grid/AgGridLinkRenderer.vue';
// 현재 사용하는 지정된 나라 의 cleavejs import
// import 하는 순서에 영향을 받아 미리 import 해야함
import Cleave from 'cleave.js';// eslint-disable-line
import CleavePhoneI18n from 'cleave.js/dist/addons/cleave-phone.i18n.js';// eslint-disable-line

// import CleavePhoneKr from 'cleave.js/dist/addons/cleave-phone.kr.js';// eslint-disable-line
// import CleavePhoneUs from 'cleave.js/dist/addons/cleave-phone.us.js';// eslint-disable-line
// import 'quasar-extras/ionicons'
import 'quasar-extras/fontawesome';
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
  Vue.use(Vuelidate);
  Vue.component('ag-grid', AgGrid);
  Vue.component('ag-grid-column', AgGridColumn);
  Vue.component('c-filter-chip', FilterChip);
  Vue.component('c-list-view', ListView);
  Vue.component('c-cleave-input', CleaveInput);
  Vue.component('c-phone-input', PhoneInput);
  Vue.component('ag-grid-checkbox-renderer', AgGridCheckboxRenderer);
  Vue.component('ag-grid-date-renderer', AgGridDateRenderer);
  Vue.component('ag-grid-datetime-renderer', AgGridDatetimeRenderer);
  Vue.component('ag-grid-checkbox-editor', AgGridCheckboxEditor);
  Vue.component('ag-grid-link-renderer', AgGridLinkRenderer);

  Vue.config.productionTip = false;
  require(`quasar/dist/quasar.${__THEME}.css`);
  if (__THEME === 'mat') {
    require('quasar-extras/roboto-font');
  }

  Vue.mixin(mixin);
};
