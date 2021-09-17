<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Action, State, namespace } from 'vuex-class';

import dialog from '@/utils/dialog';

const uStore = namespace('surveys');

@Component({
  components: {},
})
export default class Index extends Vue {
  @Action setBackUrl;
  @Action setMenu;
  @uStore.State surveys;
  @uStore.State pagination;
  @uStore.State isLoading;
  @uStore.State isModalVisible;
  @uStore.Action deleteUser;
  @uStore.Action loadSurveys;
  @uStore.Action setModalVisible;

  addURL: string;
  currentPage: number = 1; 

  tableFields = [
    {key: 'id', label: this.$t('surveys.id')},
    {key: 'name', label: this.$t('surveys.name')},
    {key: 'actions', label: this.$t('strings.actions'), tdClass: 'fit', thClass: 'fit'}
  ]

  async created() {
    this.setBackUrl(this.$router.resolve({
      name: "dashboard",
    }).href);
    this.setMenu([]);
    this.addURL = this.$router.resolve({ name: "survey.add" }).href;

    this.currentPage = this.pagination.currentPage;

    await this.getSurveys(this.currentPage);
  }

  editSurvey(survey_id): string {
    return this.$router.resolve({
      name: "survey.edit",
      params: { survey_id }    
    }).href;
  }

  async getSurveys(page: number): Promise<void> {
    this.loadSurveys({ page });
  }

  showQuestions(survey_id): string {
    return this.$router.resolve({
      name: "questions",
      params: { survey_id }    
    }).href;
  }

  showResults(survey_id): string {
    return this.$router.resolve({
      name: "survey.results",
      params: { survey_id }
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
    b-card(:header="$t('strings.surveys')")
      b-pagination(
        align='center',
        v-if='pagination.total > pagination.limit',
        v-model='currentPage',
        :per-page='pagination.limit',
        :total-rows='pagination.total',
        @change='getSurveys',
      )
      b-table(:busy="isLoading" class="m-0" :fields="tableFields" :items="surveys" head-variant="dark" outlined show-empty striped)
        template(v-slot:empty)
          h4.text-center {{ $t('strings.empty') }}
        template(v-slot:table-busy)
          div(class="text-center text-danger my-2")
            b-spinner.align-middle
            strong {{ $t('strings.loading') }}...
        template(v-slot:cell(actions)="data")          
          b-button(:to="editSurvey(data.item.id)" size="sm") {{ $t('buttons.edit') }}
          |        
          b-button(:to="showQuestions(data.item.id)" size="sm") {{ $t('strings.questions') }}
          |        
          b-button(:to="showResults(data.item.id)" size="sm") {{ $t('strings.results') }}
      b-pagination(
        align='center',
        v-if='pagination.totalUsers > pagination.perPage',
        v-model='currentPage',
        :per-page='pagination.perPage',
        :total-rows='pagination.totalUsers',
        @change='getUsers',
      )
</template>

<style>
  .fit { width: 1%!important; white-space: nowrap; }
</style>