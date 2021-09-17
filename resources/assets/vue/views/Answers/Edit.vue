<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Action, namespace } from "vuex-class";

import AnswerForm from "@/components/Answers/Form.vue";

const aState = namespace("answers");

@Component({
  components: {
    AnswerForm,
  },
})
export default class Edit extends Vue {
  @Action setBackUrl: (url: string) => void;
  @Action setMenu: ([]) => void;
  @aState.Action getAnswer: (any) => Promise<boolean>;
  @aState.Action updateAnswer: (any) => Promise<boolean>;
  @aState.State answer: Answer;
  @aState.State errors: Partial<Error>;

  backURL: string;

  created(): void {
    this.setBackUrl(this.$router.resolve({ name: "dashboard" }).href);
    this.backURL = this.$router.resolve({
      name: "answers",
      params: this.$route.params,
    }).href;    

    this.getAnswer(this.$route.params);
  }

  async onSubmit(answer: Answer): Promise<void> {
    if (await this.updateAnswer(answer)) this.$router.push(this.backURL);
  }
}
</script>

<template lang="pug">
b-container(tag="main") 
  b-button(:to="backURL") {{ $t('buttons.back') }}
  br
  br
  answer-form(
    :answer="answer",
    :errors="errors",
    :header="$t('answers.edit_answer')",
    @submit="onSubmit"
  )
</template>