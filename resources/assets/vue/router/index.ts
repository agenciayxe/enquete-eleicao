import Vue from "vue";
import Router from "vue-router";

import AuthLogin from "../views/AuthLogin.vue";
const AuthRegister = () => import("../views/AuthRegister.vue");
const AuthResetLink = () => import("../views/AuthResetLink.vue");
const AuthResetForm = () => import("../views/AuthResetForm.vue");

const AnswersAdd = () => import("../views/Answers/Add.vue");
const AnswersEdit = () => import("../views/Answers/Edit.vue");
const AnswersIndex = () => import("../views/Answers/Index.vue");
const Dashboard = () => import("../views/Dashboard.vue");
const Home = () => import("../views/Home.vue");
const Panel = () => import("../views/Panel.vue");
const Participate = () => import("../views/Participate.vue");
const QuestionsIndex = () => import("../views/Questions/Index.vue");
const QuestionsAdd = () => import("../views/Questions/Add.vue");
const QuestionsEdit = () => import("../views/Questions/Edit.vue");
const SurveysIndex = () => import("../views/Surveys/Index.vue");
const SurveyAdd = () => import("../views/Surveys/Add.vue");
const SurveyEdit = () => import("../views/Surveys/Edit.vue");
const SurveyResults = () => import("../views/Surveys/Results.vue");
const Users = () => import("../views/Users.vue");

import userTypes from "@/utils/userTypes";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/p",
      name: "panel",
      component: Panel,
      meta: {
        auth: false,
      },
      redirect: "/p/login",
      children: [        
        {
          path: "login",
          name: "auth.login",
          component: AuthLogin,     
          meta: {
            auth: false,
            title: Vue.i18n.translate("login.login", null),
          }
        },

        {
          path: "dashboard",
          name: "dashboard",
          component: Dashboard,
          meta: {
            title: Vue.i18n.translate("strings.home", null),
            auth: {
              forbiddenRedirect: "login",
              roles: userTypes.ADMIN,
            }
          }
        },

        // SURVEYS ROUTES
        {
          path: "surveys",
          name: "surveys",
          component: SurveysIndex,
          meta: {
            title: Vue.i18n.translate("strings.surveys", null),
            auth: {
              roles: userTypes.ADMIN,
              forbiddenRedirect: "/p/login",
              auth: true
            }
          }
        },
        {
          path: "surveys/:survey_id/edit",
          name: "survey.edit",
          component: SurveyEdit,
          meta: {
            title: Vue.i18n.translate("strings.surveys", null),
            auth: {
              roles: userTypes.ADMIN,
              forbiddenRedirect: "/p/login",
              auth: true
            }
          }
        },
        {
          path: "surveys/:survey_id/results",
          name: "survey.results",
          component: SurveyResults,
          meta: {
            title: Vue.i18n.translate("strings.surveys", null),
            auth: {
              roles: userTypes.ADMIN,
              forbiddenRedirect: "/p/login",
              auth: true
            }
          }
        },
        {
          path: "surveys/add",
          name: "survey.add",
          component: SurveyAdd,
          meta: {
            title: Vue.i18n.translate("strings.surveys", null),
            auth: {
              roles: userTypes.ADMIN,
              forbiddenRedirect: "/p/login",
              auth: true
            }
          }
        },

        // QUESTIONS ROUTES
        {
          path: "surveys/:survey_id/questions",
          name: "questions",
          component: QuestionsIndex,
          meta: {
            title: Vue.i18n.translate("strings.questions", null),
            auth: {
              roles: userTypes.ADMIN,
              forbiddenRedirect: "/p/login",
              auth: true
            }
          }
        },
        {
          path: "surveys/:survey_id/questions/add",
          name: "question.add",
          component: QuestionsAdd,
          meta: {
            title: Vue.i18n.translate("strings.questions", null),
            auth: {
              roles: userTypes.ADMIN,
              forbiddenRedirect: "/p/login",
              auth: true
            }
          }
        },
        {
          path: "surveys/:survey_id/questions/:question_id/edit",
          name: "question.edit",
          component: QuestionsEdit,
          meta: {
            title: Vue.i18n.translate("strings.questions", null),
            auth: {
              roles: userTypes.ADMIN,
              forbiddenRedirect: "/p/login",
              auth: true
            }
          }
        },

        // ANSWERS ROUTES
        {
          path: "surveys/:survey_id/questions/:question_id/answers",
          name: "answers",
          component: AnswersIndex,
          meta: {
            title: Vue.i18n.translate("strings.answers", null),
            auth: {
              roles: userTypes.ADMIN,
              forbiddenRedirect: "/p/login",
              auth: true
            }
          }
        },
        {
          path: "surveys/:survey_id/questions/:question_id/answers/add",
          name: "answer.add",
          component: AnswersAdd,
          meta: {
            title: Vue.i18n.translate("strings.answers", null),
            auth: {
              roles: userTypes.ADMIN,
              forbiddenRedirect: "/p/login",
              auth: true
            }
          }
        },
        {
          path:
            "surveys/:survey_id/questions/:question_id/answers/:answer_id/edit",
          name: "answer.edit",
          component: AnswersEdit,
          meta: {
            title: Vue.i18n.translate("strings.answers", null),
            auth: {
              roles: userTypes.ADMIN,
              forbiddenRedirect: "/p/login",
              auth: true
            }
          }
        },

      ]
    },

    // EXTERNAL ROUTES

    {
      path: "/v/:survey_slug",
      name: "participate",
      component: Participate,
      meta: {
        title: Vue.i18n.translate("strings.participate"),
        // auth: false
      }
    },

    // DEFAULT ROUTES

    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        title: Vue.i18n.translate("strings.app_name", null),
      }
    },

    {
      path: "/users",
      name: "users",
      component: Users,
      meta: {
        title: Vue.i18n.translate("strings.users", null),
        auth: {
          roles: userTypes.ADMIN,
          forbiddenRedirect: "/example"
        }
      }
    },
    {
      path: "/register",
      name: "auth.register",
      component: AuthRegister,
      meta: {
        title: Vue.i18n.translate("login.register", null),
        auth: false
      }
    },
    {
      path: "/password/reset",
      name: "auth.reset",
      component: AuthResetLink,
      meta: {
        title: Vue.i18n.translate("login.reset_password", null),
        auth: false
      }
    },
    {
      path: "/password/reset/:token",
      name: "auth.reset.token",
      component: AuthResetForm,
      meta: {
        title: Vue.i18n.translate("login.reset_password", null),
        auth: false
      }
    },

    {
      path: "*",
      redirect: "/"
    }    
  ]
});

// It's required for VueAuth
Vue.router = router;

export default router;
