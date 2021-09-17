<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, namespace } from "vuex-class";

import QuestionForm from "@/components/Questions/Form.vue";

const qState = namespace("questions");

@Component({
  components: {
    QuestionForm,
  },
})
export default class Add extends Vue {
  @Action setBackUrl;
  @Action setMenu;
  @qState.Action getQuestion;
  @qState.Action updateQuestion;
  @qState.State errors;
  @qState.State question;

  backURL;

  async created(): Promise<void> {
    this.setBackUrl(this.$router.resolve({ name: "dashboard" }).href);
    this.setMenu([]);

    this.getQuestion(this.$route.params);
    this.backURL = this.$router.resolve({ name: "questions", params: this.$route.params }).href;
  }

  async onSubmit(question: Question): Promise<void> {
    if (await this.updateQuestion(question)) this.$router.push(this.backURL);
  }
}
</script>

<template lang="pug">
b-container(tag="main") 
  b-button(:to="backURL") {{ $t('buttons.back') }}
  br
  br
  question-form(:errors="errors", :header="$t('questions.edit_question')", :question="question", @submit="onSubmit")
</template>
