<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, namespace } from "vuex-class";

import SurveyForm from "@/components/Surveys/Form.vue";

const sState = namespace("surveys");

@Component({
  components: {
    SurveyForm,
  },
})
export default class Add extends Vue {
  @Action setBackUrl;
  @Action setMenu;
  @sState.Action getSurvey;
  @sState.Action updateSurvey;
  @sState.State errors;
  @sState.State survey;

  backURL: string;

  async created(): Promise<void> {
    this.setBackUrl(this.$router.resolve({ name: "dashboard" }).href);
    this.backURL = this.$router.resolve({
      name: "surveys",
      params: this.$route.params,
    }).href;
    this.setMenu([]);

    this.getSurvey(this.$route.params.survey_id);
  }

  async onSubmit(survey: Survey): Promise<void> {
    if (await this.updateSurvey(survey)) this.$router.push(this.backURL);
  }
}
</script>

<template lang="pug">
b-container(tag="main") 
  b-button(:to="backURL") {{ $t('buttons.back') }}
  br
  br
  survey-form(
    :errors="errors",
    :header="$t('surveys.edit_survey')"
    :survey="survey",     
    @submit="onSubmit"
  )
</template>
