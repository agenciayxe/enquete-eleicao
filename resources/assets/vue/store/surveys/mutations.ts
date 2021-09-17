import Vue from "vue";

const SET_ERRORS = (state, payload) => {
  state.errors = payload;
};

const SET_SURVEY = (state, payload) => {
  state.survey = payload;
};

const SET_SURVEYS = (state, payload) => {
  state.surveys = payload.data;

  state.pagination = {
    current: payload.current_page,
    limit: payload.per_page,
    total: payload.total,
    pages: payload.last_page
  };
};

const TOGGLE_IS_SUBMITTING = (state, payload) => {
  state.isSubmitting = !state.isSubmitting;
};

const SET_LOADING = (state, payload) => {
  state.isLoading = payload;
};

export default {
  SET_ERRORS,
  SET_LOADING,
  SET_SURVEY,
  SET_SURVEYS,
  TOGGLE_IS_SUBMITTING
};
