<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, namespace } from "vuex-class";

import QuestionForm from "@/components/Questions/Form.vue";

const sState = namespace("questions");

@Component({
  components: {
    QuestionForm,
  },
})
export default class Add extends Vue {
  @Action setBackUrl: (url: string) => void;
  @Action setMenu: ([]) => void;
  @sState.Action addQuestion: (question: Partial<Question>) => Promise<boolean>;
  @sState.State errors;

  backURL: string;
  question: Partial<Question>;

  async created(): Promise<void> {
    this.setBackUrl(this.$router.resolve({ name: "dashboard" }).href);
    this.setMenu([]);
    this.backURL = this.$router.resolve({ name: "questions", params: this.$route.params }).href;
    this.question = {
      survey_id: Number(this.$route.params.survey_id),
    };
  }

  async onSubmit(question: Partial<Question>) {
    if (await this.addQuestion(question)) this.$router.push(this.backURL);
  }
}
</script>

<template lang="pug">
b-container(tag="main") 
  b-button(:to="backURL") {{ $t('buttons.back') }}
  br
  br
  question-form(
    :errors="errors"
    :header="$t('questions.add_question')",
    :question="question",
    @submit="onSubmit"
  )
</template>
