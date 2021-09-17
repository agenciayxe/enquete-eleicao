<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, State, namespace } from 'vuex-class';

import dialog from '@/utils/dialog';

const aStore = namespace('answers');

@Component({
  components: {},
})
export default class Index extends Vue {
  @Action setBackUrl;
  @Action setMenu;
  @aStore.Action loadAnswers;  
  @aStore.State answers;
  @aStore.State pagination;
  @aStore.State isLoading;  

  currentPage: number = 1; 

  tableFields = [
    {key: 'id', label: this.$t('answers.id')},
    {key: 'order', label: this.$t('answers.order')},
    {key: 'body', label: this.$t('answers.body')},
    {key: 'actions', label: this.$t('strings.actions'), tdClass: 'fit', thClass: 'fit'}
  ]

  addURL(): string {
    return this.$router.resolve({ name: "answer.add", params: this.$route.params }).href;
  }

  async created(): Promise<void> {
    this.setBackUrl(this.$router.resolve({ name: "dashboard" }).href);
    this.setMenu([]);

    this.currentPage = this.pagination.currentPage;

    await this.getAnswers(this.currentPage);
  }

  editURL(answer_id): string {
    return this.$router.resolve({
      name: "answer.edit", 
      params: { ...this.$route.params, answer_id }
    }).href;    
  }

  async getAnswers(page: number): Promise<void> {
    this.loadAnswers({ page, ...this.$route.params });
  }

  showAnswers(question: Question): string {
    return `/panel/surveys/${question.id}/questions/${question.id}/answers`;
  }
}
</script>

<template lang="pug">
b-container(tag='main')

  b-button(:to="addURL()" variant="primary") {{ $t('buttons.add') }}
  br
  br

  b-card-group(deck)
    b-card(:header="$t('strings.answers')")      
      b-pagination(
        align='center',
        v-if='pagination.total > pagination.limit',
        v-model='currentPage',
        :per-page='pagination.limit',
        :total-rows='pagination.total',
        @change='getAnswers',
      )
      b-table(:busy="isLoading" class="m-0" :fields="tableFields" :items="answers" head-variant="dark" outlined show-empty striped)
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
            b-button(size="sm" :to="editURL(data.item.id)") {{ $t('buttons.edit') }}            
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