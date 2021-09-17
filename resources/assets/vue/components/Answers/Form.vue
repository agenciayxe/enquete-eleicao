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
    @Prop() answer: Partial<Answer>;
    @Prop({}) errors;
    @Watch('errors')
    onErrorChange(errors) {
        this.errors = errors;
    }
    @Watch('answer')
    onQuestionChange(answer: Partial<Answer>) {
        this.form = answer;
    }
    form: Partial<Answer> = {};
    types: any[] = [
    ];

    created() {
        if(this.answer) this.form = this.answer;
    }
}
</script>

<template lang="pug">
b-form(v-on:submit.prevent="$emit('submit', form)")  
    b-card-group(deck)
        b-card(:header="header")
            b-form-group(:label="$t('answers.body')", label-for="body")
                wysiwyg(v-model="form.body")
                span.help-block(v-if="errors && errors.body")
                    strong *{{ errors.body[0] }}
            b-form-group(id="order" :label="$t('answers.order')" label-for="order")
                b-form-input(id="order" v-model="form.order" :state="!!errors && errors.order ? false : undefined")
                span.help-block(v-if="errors && errors.order")
                    strong *{{ errors.order[0] }}                  
            b-form-group(id="order" :label="$t('answers.image')" label-for="image")  
                b-form-file(accept="image/*" v-model="form.file" plain)       
            b-form-group(id="order" :label="$t('answers.justify')" label-for="justify")  
                b-form-checkbox(                    
                    id="justify"
                    v-model="form.justify"
                    value="1"      
                )      
            template(v-slot:footer)
                div.text-right
                    b-button(type="submit" variant="success") {{ $t('buttons.save') }}
</template>