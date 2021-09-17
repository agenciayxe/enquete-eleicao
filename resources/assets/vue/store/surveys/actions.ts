import axios from "axios";
import checkResponse from "@/utils/checkResponse";

const addSurvey = async ({ commit }, payload): Promise<Boolean> => {
  const survey: Partial<Survey> = {
    afterword: payload.afterword,
    description: payload.description,
    due_at: payload.due_at,
    execution: payload.execution,
    introduction: payload.introduction,
    name: payload.name,
    type: payload.type,
    unique: payload.unique
  };

  var tmp = document.createElement("DIV");
  tmp.innerHTML = survey.afterword || "";

  if (!tmp.textContent?.trim() && !tmp.innerText.trim()) survey.afterword = "";

  tmp.innerHTML = survey.description || "";
  if (!tmp.textContent?.trim() && !tmp.innerText.trim()) survey.description = "";

  tmp.innerHTML = survey.introduction || "";
  if (!tmp.textContent?.trim() && !tmp.innerText.trim())
    survey.introduction = "";

  var formData = new FormData();
  formData.append("afterword", (survey.afterword as unknown) as string);
  formData.append("description", (survey.description || ("" as unknown)) as string);
  formData.append("due_at", (survey.due_at || ("" as unknown)) as string);
  formData.append("execution", (survey.execution || ("" as unknown)) as string);
  formData.append("introduction", (survey.introduction as unknown) as string);
  formData.append("name", (survey.name as unknown) as string);
  formData.append("unique", (survey.unique as unknown) as string);

  if (!!payload.cover) {
    formData.append("cover", payload.cover);
  }

  if (!!payload.final_sound) {
    formData.append("final_sound", payload.final_sound);
  }

  commit("TOGGLE_IS_SUBMITTING");
  try {
    const response = await axios.post(`surveys`, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
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

const getSurvey = async ({ commit }, payload) => {  
  commit("SET_LOADING", true);
  try {
    const response = await axios.get(`surveys/${payload}`);
    const checkErrors = checkResponse(response);

    if (checkErrors) {
      commit("SET_DIALOG_MESSAGE", checkErrors.message, { root: true });
    } else {
      commit("SET_SURVEY", response.data);
    }
  } catch (e) {
    commit("SET_DIALOG_MESSAGE", "errors.generic_error", { root: true });
  } finally {
    commit("SET_LOADING", false);
  }
};

const getSurveyResults = async ({ commit }, payload) => {  
  commit("SET_LOADING", true);
  try {
    const response = await axios.get(`surveys/${payload}/results`);
    const checkErrors = checkResponse(response);

    if (checkErrors) {
      commit("SET_DIALOG_MESSAGE", checkErrors.message, { root: true });
    } else {
      commit("SET_SURVEY", response.data);
    }
  } catch (e) {
    commit("SET_DIALOG_MESSAGE", "errors.generic_error", { root: true });
  } finally {
    commit("SET_LOADING", false);
  }
};

const loadSurveys = async ({ commit }, payload) => {
  commit("SET_LOADING", true);
  try {
    const response = await axios.get(`surveys?page=${payload.page}`);
    const checkErrors = checkResponse(response);

    if (checkErrors) {
      commit("SET_DIALOG_MESSAGE", checkErrors.message, { root: true });
    } else {
      commit("SET_SURVEYS", response.data);
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

const updateSurvey = async ({ commit }, payload): Promise<Boolean> => {
  const survey: Partial<Survey> = {
    afterword: payload.afterword,
    description: payload.description,
    due_at: payload.due_at,
    execution: payload.execution,
    introduction: payload.introduction,
    name: payload.name,
    type: payload.type,
    unique: payload.unique,
  };

  var tmp = document.createElement("DIV");
  tmp.innerHTML = survey.afterword || "";
  if (!tmp.textContent?.trim() && !tmp.innerText.trim()) survey.afterword = "";

  tmp.innerHTML = survey.description || "";
  if (!tmp.textContent?.trim() && !tmp.innerText.trim()) survey.description = "";

  tmp.innerHTML = survey.introduction || "";
  if (!tmp.textContent?.trim() && !tmp.innerText.trim())
    survey.introduction = "";

  var formData = new FormData();
  formData.append("afterword", (survey.afterword as unknown) as string);
  formData.append("description", (survey.description || ("" as unknown)) as string);
  formData.append("due_at", (survey.due_at || ("" as unknown)) as string);
  formData.append("execution", (survey.execution || ("" as unknown)) as string);
  formData.append("introduction", (survey.introduction as unknown) as string);
  formData.append("name", (survey.name as unknown) as string);
  formData.append("unique", (survey.unique as unknown) as string);

  if (!!payload.cover) {
    formData.append("cover", payload.cover);
  }

  if (!!payload.final_sound) {
    formData.append("final_sound", payload.final_sound);
  }

  commit("TOGGLE_IS_SUBMITTING");
  try {
    const response = await axios.post(
      `surveys/${payload.id}?_method=PUT`,
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
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

export default {
  addSurvey,
  getSurvey,
  getSurveyResults,
  loadSurveys,
  setErrors,
  updateSurvey
};
