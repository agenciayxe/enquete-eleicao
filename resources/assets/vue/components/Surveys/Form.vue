<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import wysiwyg from "vue-wysiwyg";
import "vue-wysiwyg/dist/vueWysiwyg.css";
Vue.use(wysiwyg, {
  image: {
    uploadURL: "/api/images",
    dropzoneOptions: {},
  },
});

@Component
export default class Form extends Vue {
  @Prop() errors;
  @Watch("errors")
  onErrorChange(errors) {
    this.errors = errors;
  }
  @Prop() header: string;
  @Prop() isSubmitting: boolean;
  @Watch("isSubmitting")
  onIsSubmittingChange(isSubmitting: boolean) {
    this.isSubmitting = isSubmitting;
  }
  @Prop() survey: Partial<Survey>;
  @Watch("survey")
  onSurveyChange(survey: Partial<Survey>) {
    survey.cover = undefined;
    survey.final_sound = undefined;
    this.form = survey;
  }
  form: Partial<Survey> = {};

  created(): void {
    if (this.survey) {
      this.form = this.survey;
    }
  }
}
</script>

<template lang="pug">
b-form(v-on:submit.prevent="$emit('submit', form)") 
  b-card(class="mb-4" :header="header")
    b-form-group(:label="$t('surveys.name')", label-for="name")
      b-form-input(
        type="text",
        v-model="form.name",
        name="name",
        maxlength="191",
        autofocus
      )
      span.help-block(v-if="errors.name")
        strong *{{ errors.name[0] }}

    b-form-group(:label="$t('surveys.execution')", label-for="execution")
      b-form-select(
        id="execution" 
        v-model="form.execution" 
        :options="[{ text: $t('surveys.executions.1'), value: 1}, { text: $t('surveys.executions.2'), value: 2}, { text: $t('surveys.executions.3'), value: 3}]"
      )

    b-form-group(:label="$t('surveys.due_at')", label-for="due-at")
      b-form-input(id="due-at" v-model="form.due_at" type="date")
    
    b-form-group(:label="$t('surveys.cover')", label-for="cover")
      b-form-file(accept="image/*" v-model="form.cover" plain)
    
    b-form-group(:label="$t('surveys.final_sound')", label-for="final-sound")
      b-form-file(accept="audio/*" v-model="form.final_sound" plain)
    
    b-form-group(:label="$t('surveys.unique')", label-for="unique")
      b-form-select(
        id="unique" 
        v-model="form.unique" 
        :options="[{ text: $t('surveys.unique.0'), value: 0}, { text: $t('surveys.unique.1'), value: 1}]"
      )
      
    b-form-group(:label="$t('surveys.description')", label-for="description")
      wysiwyg(v-model="form.description")

    b-form-group(:label="$t('surveys.introduction')", label-for="introduction")
      wysiwyg(v-model="form.introduction")

    b-form-group(:label="$t('surveys.afterword')", label-for="afterword")
      wysiwyg(v-model="form.afterword")
    template(v-slot:footer)
      div.text-right
        b-button(type="submit" variant="success") {{ $t('buttons.save') }}
</template>

<style lang="scss" scoped>
</style>
