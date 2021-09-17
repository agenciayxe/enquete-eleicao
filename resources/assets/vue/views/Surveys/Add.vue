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
  @sState.Action addSurvey;
  
  @sState.State errors;

  backURL: string;

  async created(): Promise<void> {
    this.setBackUrl(this.$router.resolve({ name: "dashboard" }).href);
    this.setMenu([]);
    this.backURL = this.$router.resolve({ name: "surveys" }).href;
  }

  async onSubmit(survey: Partial<Survey>) {
    if(await this.addSurvey(survey)) this.$router.push(this.backURL);
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
    :header="$t('surveys.add_survey')"
    @submit="onSubmit"
  )
</template>
