import Vue from 'vue';

import {
  CardPlugin,
  ButtonPlugin,
  ModalPlugin,
  FormPlugin,
  ListGroupPlugin,
  NavbarPlugin,
  ProgressPlugin,
  BContainer,
  BRow,  
  BCol,
  BBadge,
  BLink,
  BFormSelect,
  BFormInput,
  BPagination,
  BFormCheckbox,
  BFormFile,
  BFormGroup,
  BFormTextarea,
  BFormRadioGroup,
  BFormRadio,
  BModal,
  BDropdown,
  BDropdownItem,
  BProgress,
  BProgressBar,
  BSpinner,
  BTable
} from 'bootstrap-vue';

Vue.component('b-dropdown', BDropdown);
Vue.component('b-dropdown-item', BDropdownItem);

Vue.use(ButtonPlugin);
Vue.use(CardPlugin);
Vue.use(FormPlugin);
Vue.use(ListGroupPlugin);
Vue.use(ModalPlugin);
Vue.use(NavbarPlugin);
Vue.use(ProgressPlugin);
Vue.component('b-badge', BBadge);
Vue.component('b-container', BContainer);
Vue.component('b-col', BCol);
Vue.component('b-link', BLink);
Vue.component('b-form-input', BFormInput);
Vue.component('b-form-select', BFormSelect);
Vue.component('b-form-group', BFormGroup);
Vue.component('b-form-textarea', BFormTextarea);
Vue.component('b-form-file', BFormFile);
Vue.component('b-form-checkbox', BFormCheckbox);
Vue.component('b-form-radio-group', BFormRadioGroup);
Vue.component('b-form-radio', BFormRadio);
Vue.component('b-modal', BModal);
Vue.component('b-row', BRow);
Vue.component('b-spinner', BSpinner);
Vue.component('b-pagination', BPagination);
Vue.component('b-progress', BProgress);
Vue.component('b-progress-bar', BProgressBar);
Vue.component('b-table', BTable);
