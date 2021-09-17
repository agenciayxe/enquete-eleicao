import Vue from 'vue';

import 'promise-polyfill/src/polyfill';
import Vuex from 'vuex';

import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

import answers from './answers';
import messages from './messages';
import questions from './questions';
import surveys from './surveys';
import users from './users';

Vue.use(Vuex);

const modules = {
  answers,
  messages,
  questions,
  surveys,
  users,
};

const store = new Vuex.Store({
  modules,
  actions,
  getters,
  mutations,
  state,
});

export default store;
