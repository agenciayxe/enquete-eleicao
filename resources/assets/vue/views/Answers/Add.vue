<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Action, namespace } from "vuex-class";

import AnswerForm from "@/components/Answers/Form.vue";

const aState = namespace("answers");

@Component({
    components: {
        AnswerForm
    }
})
export default class Add extends Vue {    
    @Action setBackUrl: (url: string) => void;
    @Action setMenu: ([]) => void;
    @aState.Action addAnswer: (question: Partial<Answer>) => Promise<boolean>;
    @aState.State errors: Partial<Error>;

    answer: Partial<Answer>;    
    backURL: string;
    
    created(): void {
        this.setBackUrl(this.$router.resolve({ name: "dashboard" }).href);
        this.backURL = this.$router.resolve({ name: 'answers', params: this.$route.params }).href;
        this.answer = {
            question_id: Number(this.$route.params.question_id),
        };
    }

    async onSubmit(answer: Partial<Answer>): Promise<void> {
        if(await this.addAnswer(answer)) this.$router.push(this.backURL);
    }
}
</script>

<template lang="pug">
b-container(tag="main") 
  b-button(:to="backURL") {{ $t('buttons.back') }}
  br
  br
  answer-form(
    :answer="answer"
    :errors="errors"
    :header="$t('answers.add_answer')",
    @submit="onSubmit"
  )
</template>