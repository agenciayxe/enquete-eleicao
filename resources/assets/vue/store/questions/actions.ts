import axios from "axios";
import checkResponse from "@/utils/checkResponse";

const addQuestion = async ({ commit }, payload): Promise<Boolean> => {
  const question: Partial<Question> = {
    survey_id: payload.survey_id,
    body: payload.body,
    group: payload.group,
    order: payload.order,
    type: payload.type
  };

  var tmp = document.createElement("DIV");
  tmp.innerHTML = question.body || "";
  if (!tmp.textContent?.trim() && !tmp.innerText.trim())
    question.body = "";

  commit("TOGGLE_IS_SUBMITTING");
  try {
    const response = await axios.post(
      `surveys/${payload.survey_id}/questions`,
      question
    );
    const checkErrors = checkResponse(response);

    if (checkErrors) {
      setErrors({ commit }, response.data.errors);
      commit("TOGGLE_IS_SUBMITTING");
      return false;
    }
  } catch {
  } finally {
  }
  return true;
};

const getQuestion = async ({ commit }, payload) => {
  commit("SET_LOADING", true);
  try {
    const response = await axios.get(
      `surveys/${payload.survey_id}/questions/${payload.question_id}`
    );
    const checkErrors = checkResponse(response);

    if (checkErrors) {
      commit("SET_DIALOG_MESSAGE", checkErrors.message, { root: true });
    } else {
      commit("SET_QUESTION", response.data);
    }
  } catch (e) {
    commit("SET_DIALOG_MESSAGE", "errors.generic_error", { root: true });
  } finally {
    commit("SET_LOADING", false);
  }
};

const loadQuestions = async ({ commit }, payload) => {
  commit("SET_LOADING", true);
  try {
    const response = await axios.get(
      `surveys/${payload.survey_id}/questions?page=${payload.page}`
    );
    const checkErrors = checkResponse(response);

    if (checkErrors) {
      commit("SET_DIALOG_MESSAGE", checkErrors.message, { root: true });
    } else {
      commit("SET_QUESTIONS", response.data);
    }
  } catch (e) {
    commit("SET_DIALOG_MESSAGE", "errors.generic_error", { root: true });
  } finally {
    commit("SET_LOADING", false);
  }
};

const setErrors = async ({ commit }, payload) => {
  commit("SET_ERRORS", payload);
};

const updateQuestion = async ({ commit }, payload): Promise<Boolean> => {
  const question: Partial<Question> = {
    survey_id: payload.survey_id,
    body: payload.body,
    group: payload.group,
    order: payload.order,
    type: payload.type
  };

  var tmp = document.createElement("DIV");
  tmp.innerHTML = question.body || "";
  if (!tmp.textContent?.trim() && !tmp.innerText.trim())
    question.body = "";

  commit("TOGGLE_IS_SUBMITTING");
  try {
    const response = await axios.put(`surveys/${payload.survey_id}/questions/${payload.id}`, question);
    const checkErrors = checkResponse(response);

    if (checkErrors) {
      setErrors({ commit }, response.data.errors);
      commit("TOGGLE_IS_SUBMITTING");
      return false;
    } 
  } catch {}
  commit("TOGGLE_IS_SUBMITTING");
  return true;
};

// const editUser = async ({ commit }, payload) => {
//   const user = {
//     name: payload.name,
//     email: payload.email,
//     type_id: payload.type_id,
//     password: payload.password,
//     password_confirmation: payload.password_confirmation,
//   };

//   commit('SET_MODAL_LOADING', true);

//   try {
//     const response = await axios.put(`users/${payload.id}`, user);
//     const checkErrors = checkResponse(response);

//     if (checkErrors) {
//       commit('SET_DIALOG_MESSAGE', checkErrors.message, { root: true });
//     } else {
//       commit('UPDATE_USER', response.data);
//       commit('SET_MODAL_VISIBLE', false);
//     }
//   } catch {
//     commit('SET_DIALOG_MESSAGE', 'errors.generic_error', { root: true });
//   } finally {
//     commit('SET_MODAL_LOADING', false);
//   }
// };

// const deleteUser = async ({ commit }, payload) => {
//   try {
//     const response = await axios.delete(`users/${payload.id}`);
//     const checkErrors = checkResponse(response);

//     if (checkErrors) {
//       commit('SET_DIALOG_MESSAGE', checkErrors.message, { root: true });
//     } else {
//       commit('DELETE_USER', payload);
//       commit('SET_DIALOG_MESSAGE', 'front.deleted_successfully', { root: true });
//     }
//   } catch {
//     commit('SET_DIALOG_MESSAGE', 'errors.generic_error', { root: true });
//   }
// };

// const setModalVisible = ({ commit }, payload) => {
//   commit('SET_MODAL_VISIBLE', payload);
// };

export default {
  addQuestion,
  getQuestion,
  loadQuestions,
  setErrors,
  updateQuestion
};
