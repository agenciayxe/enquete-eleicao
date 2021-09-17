import axios from "axios";
import checkResponse from "@/utils/checkResponse";

const addAnswer = async ({ commit }, payload): Promise<Boolean> => {
  const answer: Partial<Answer> = {
    question_id: payload.question_id,
    body: payload.body,
    justify: payload.justify || 0,
    order: Number(payload.order || 0),    
  };

  commit("TOGGLE_IS_SUBMITTING");
  try {
    var formData = new FormData();
    formData.append("question_id", (answer.question_id as unknown) as string);
    formData.append("body", (answer.body as unknown) as string);
    formData.append("justify", (answer.justify as unknown) as string);
    formData.append("order", (answer.order as unknown) as string);
    if (payload.file) {
      formData.append("image", payload.file);
    }
    const response = await axios.post(
      `surveys/${payload.survey_id}/questions/${payload.question_id}/answers`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    const checkErrors = checkResponse(response);

    if (checkErrors) {
      setErrors({ commit }, response.data.errors);
      commit("TOGGLE_IS_SUBMITTING");
      return false;
    }
  } catch (e) {
    commit("TOGGLE_IS_SUBMITTING");
    return false;
  } 
  return true;
};

const getAnswer = async ({ commit }, payload) => {
  commit("SET_LOADING", true);
  try {
    const response = await axios.get(
      `surveys/${payload.survey_id}/questions/${payload.question_id}/answers/${payload.answer_id}`
    );
    const checkErrors = checkResponse(response);

    if (checkErrors) {
      commit("SET_DIALOG_MESSAGE", checkErrors.message, { root: true });
    } else {
      commit("SET_ANSWER", response.data);
    }
  } catch (e) {
    commit("SET_DIALOG_MESSAGE", "errors.generic_error", { root: true });
  } finally {
    commit("SET_LOADING", false);
  }
};

const loadAnswers = async ({ commit }, payload) => {
  commit("SET_LOADING", true);
  try {
    const response = await axios.get(
      `surveys/${payload.survey_id}/questions/${payload.question_id}/answers?page=${payload.page}`
    );
    const checkErrors = checkResponse(response);

    if (checkErrors) {
      commit("SET_DIALOG_MESSAGE", checkErrors.message, { root: true });
    } else {
      commit("SET_ANSWERS", response.data);
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

const updateAnswer = async ({ commit }, payload): Promise<Boolean> => {
  const answer: Partial<Answer> = {
    question_id: payload.question_id,
    body: payload.body,
    justify: payload.justify || 0,
    order: payload.order || 0
  };

  commit("TOGGLE_IS_SUBMITTING");
  try {
    var formData = new FormData();
    formData.append("question_id", (answer.question_id as unknown) as string);
    formData.append("body", (answer.body as unknown) as string);
    formData.append("justify", (answer.justify as unknown) as string);
    formData.append("order", (answer.order as unknown) as string);    

    if (!!payload.file) {
      formData.append("image", payload.file);
    }

    const response = await axios.post(
      `surveys/${payload.survey_id}/questions/${payload.question_id}/answers/${payload.id}?_method=PUT`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",          
        }
      }
    );
    const checkErrors = checkResponse(response);

    if (checkErrors) {
      setErrors({ commit }, response.data.errors);
      //   commit('SET_DIALOG_MESSAGE', checkErrors.message, { root: true });
      commit("TOGGLE_IS_SUBMITTING");
      return false;
    } 
    commit("TOGGLE_IS_SUBMITTING");
    return true;
  } catch {}
  commit("TOGGLE_IS_SUBMITTING");
  return false;
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
  addAnswer,
  getAnswer,
  loadAnswers,
  setErrors,
  updateAnswer
};
