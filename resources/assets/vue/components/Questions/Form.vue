<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import wysiwyg from "vue-wysiwyg";
import "vue-wysiwyg/dist/vueWysiwyg.css";
Vue.use(wysiwyg, {
  image: {
    uploadURL: "/api/images",
    dropzoneOptions: {}
  },
});

@Component
export default class Form extends Vue {
    @Prop() header: string;
    @Prop() question: Partial<Question>;
    @Prop({}) errors;
    @Watch('errors')
    onErrorChange(errors) {
        this.errors = errors;
    }
    @Watch('question')
    onQuestionChange(question: Partial<Question>) {
        this.form = question;
    }
    form: Partial<Question> = {};
    types: any[] = [
        {text:"Escolha Única", value: 1}
    ];

    created() {
        if(this.question) this.form = this.question;
    }
}
</script>

<template lang="pug">
b-form(v-on:submit.prevent="$emit('submit', form)")  
    b-card-group(deck)
        b-card(:header="header")
            b-form-group(id="type" :label="$t('questions.type')" label-for="type")
                b-form-select(id="type" v-model="form.type" :options="types" :state="!!errors && errors.type ? false : undefined")
                span.help-block(v-if="errors && errors.type")
                    strong *{{ errors.type[0] }}
            b-form-group(id="group" :label="$t('questions.group')" label-for="group")
                b-form-input(id="group" v-model="form.group" :state="!!errors && errors.group ? false : undefined")
                span.help-block(v-if="errors && errors.group")
                    strong *{{ errors.group[0] }}
            b-form-group(id="order" :label="$t('questions.order')" label-for="order")
                b-form-input(id="order" v-model="form.order" :state="!!errors && errors.order ? false : undefined" type="number")
                span.help-block(v-if="errors && errors.order")
                    strong *{{ errors.order[0] }}
            b-form-group(:label="$t('questions.body')", label-for="body")
                wysiwyg(v-model="form.body")
            //- b-form-group(id="body" :label="$t('questions.body')" label-for="body")
                //- b-form-textarea(id="body" v-model="form.body" :state="!!errors && errors.body ? false : undefined")
                span.help-block(v-if="errors && errors.body")
                    strong *{{ errors.body[0] }}
            template(v-slot:footer)
                div.text-right
                    b-button(type="submit" variant="success") {{ $t('buttons.save') }}
</template>
