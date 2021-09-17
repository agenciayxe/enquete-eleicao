<script lang="ts">
import VueApexCharts from "vue-apexcharts";
import { Component, Vue, Watch } from "vue-property-decorator";
import { Action, namespace } from "vuex-class";

Vue.use(VueApexCharts);

const sState = namespace("surveys");

@Component({
  components: {
    apexcharts: VueApexCharts,
  },
})
export default class Results extends Vue {
  @Action setBackUrl;
  @sState.Action getSurvey;
  @sState.Action getSurveyResults;
  @sState.State survey;

  backURL: string;
  charts = {};
  total: any = {};

  async created(): Promise<void> {
      this.setBackUrl(this.$router.resolve({ name: "dashboard" }).href);
    this.backURL = this.$router.resolve({ name: "surveys" }).href;
    this.getSurveyResults(this.$route.params.survey_id);
  }

  @Watch("survey")
  onSurveyChange(survey) {
    this.total = survey.votes.reduce(function (carrier, current) {
      if (!carrier[current.question]) carrier[current.question] = 0;
      carrier[current.question] += current.votes;
      return carrier;
    }, {});
    survey.votes.forEach((vote) => {
      if (!!vote.justifications && !this.charts[vote.answer_id]) {
        this.charts[vote.answer_id] = {
          series: [...vote.justifications.map(justification => justification.quantity)],
          chartOptions: {
            chart: {
              width: 380,
              type: "pie",
            },
            labels: [...vote.justifications.map(justification => justification.body || 'Empty')],
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: { width: 200 },
                  legend: { position: "bottom" },
                },
              },
            ],
          },
        };
      };
      vote.percentage = ((vote.votes / this.total[vote.question]) * 100).toFixed(2);
    });
  }
}
</script>

<template lang="pug">
b-container(tag="main")
  b-button(:to="backURL") {{ $t('buttons.back') }}
  br
  br
  b-card(v-if="survey", :header="survey.name")
    b-card-body
      //- pre {{ survey.votes }}
      div(v-for="question in survey.questions")
        b-card(:key="question.id")
          template(v-slot:header)
            h5(v-html="question.body")
          b-card-text
            div(
              v-for="vote in survey.votes.filter((vote) => question.body === vote.question)"
            )
              span {{ vote.answer }}
              b-progress
                b-progress-bar(
                  :max="total[vote.question]",
                  :label="`(${vote.votes}) ${vote.percentage}%`",
                  variant="success",
                  :value="vote.votes"
                )
              .text-center(v-if="!!vote.justifications.length")
                    apexcharts(
                        :options="charts[vote.answer_id].chartOptions",
                        :series="charts[vote.answer_id].series",
                        type="pie"
                        width="300"
                    )
        br
</template>

<style>
.bg-success {
  background-color: #28a745 !important;
  color: white;
}
.progress,
.progress-bar {
  display: flex;
  overflow: hidden;
}
.progress {
  height: 1rem;
  line-height: 0;
  font-size: 0.75rem;
  background-color: #e9ecef;
  border-radius: 0.25rem;
}
.progress-bar {
  flex-direction: column;
  justify-content: center;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  background-color: #007bff;
  transition: width 0.6s ease;
}
</style>