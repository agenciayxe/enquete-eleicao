<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, State, namespace } from 'vuex-class';

import dialog from '@/utils/dialog';

const uStore = namespace('questions');

@Component({
  components: {},
})
export default class Index extends Vue {
  @Action setBackUrl;
  @Action setMenu;
  @uStore.State questions;
  @uStore.State pagination;
  @uStore.State isLoading;  
  @uStore.Action loadQuestions;  

  addURL: string;
  currentPage: number = 1; 

  tableFields = [
    {key: 'id', label: this.$t('questions.id')},
    {key: 'type', label: this.$t('questions.type')},
    {key: 'group', label: this.$t('questions.group')},
    {key: 'body', label: this.$t('questions.body') },
    {key: 'actions', label: this.$t('strings.actions'), tdClass: 'fit', thClass: 'fit'}
  ]

  async created(): Promise<void> {
    this.setBackUrl(this.$router.resolve({ name: "dashboard" }).href);
    this.setMenu([]);

    this.addURL = this.$router.resolve({
      name: "question.add",
      params: this.$route.params
    }).href;

    this.currentPage = this.pagination.currentPage;

    await this.getQuestions(this.currentPage);
  }
  
  editQuestion(question_id): string {
    return this.$router.resolve({
      name: "question.edit",
      params: { ...this.$route.params, question_id }
    }).href;    
  }

  async getQuestions(page: number): Promise<void> {
    this.loadQuestions({ page, survey_id: this.$route.params.survey_id });
  }

  showAnswers(question_id): string {
    return this.$router.resolve({
      name: "answers",
      params: { ...this.$route.params, question_id }
    }).href;
  }
}
</script>

<template lang="pug">
b-container(tag='main')

  b-button(:to="addURL" variant="primary") {{ $t('buttons.add') }}
  br
  br

  b-card-group(deck)
    b-card(:header="$t('strings.questions')")      
      b-pagination(
        align='center',
        v-if='pagination.total > pagination.limit',
        v-model='currentPage',
        :per-page='pagination.limit',
        :total-rows='pagination.total',
        @change='getQuestions',
      )
      b-table(
        :busy="isLoading" 
        class="m-0"
        :fields="tableFields" 
        :items="questions" 
        head-variant="dark" 
        outlined 
        show-empty 
        striped
      )
        template(v-slot:empty="scope")
          h4(class="text-center") {{ $t('strings.empty') }}        
        template(v-slot:table-busy)
          div(class="text-center text-danger my-2")
            b-spinner(class="align-middle")
            strong {{ $t('strings.loading') }}...
        template(v-slot:cell(body)="data")
          div(v-html="data.item.body")
        template(v-slot:cell(actions)="data")
          <div>
            b-button(size="sm" :to="editQuestion(data.item.id)") {{ $t('buttons.edit') }}
            | 
            b-button(size="sm" v-if="data.item.type === 1" :to="showAnswers(data.item.id)") {{ $t('strings.answers') }}
          </div>
      b-pagination(
        align='center',
        v-if='pagination.total > pagination.limit',
        v-model='currentPage',
        :per-page='pagination.limit',
        :total-rows='pagination.total',
        @change='getQuestions',
      )
</template>

<style>
  .fit { width: 1%!important; white-space: nowrap; }
</style>