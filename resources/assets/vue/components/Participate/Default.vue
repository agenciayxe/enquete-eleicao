<script lang="ts">
import axios from "axios";
import { v4 as uuid } from "uuid";
import { Component, Prop, Vue } from "vue-property-decorator";


@Component
class Political extends Vue {
    @Prop() data;
    audio;  
    dialog: boolean = false;    
    expired: boolean = false;
    group: number = 0;
    groups: string[] = [];
    introduction: boolean = false;
    loading: boolean = true;
    step = 0;
    result;
    session_id;
    survey: Survey;
    voted: boolean = false;
    votes:any[] = [];
    
    back() {
        if(this.step > 0) this.step--;
        this.step = 0;
    }

    async created() {
        this.session_id = window.localStorage.getItem('session_id');
        if(!this.session_id) {
            const session_id = uuid();
            window.localStorage.setItem('session_id', uuid());
            this.session_id = session_id;
        }        
        await this.getSurvey();
        if(2 === this.survey.execution) {
            this.groups = this.survey.questions.map(question => question.group).filter((group, index, arr) => index === arr.indexOf(group));        
            this.group = 0;
        }
        if(!this.voted && this.survey.introduction) this.introduction = true;
        this.loading = false;
    }

    get facebookURL() {
        return `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
    }

    async getSurvey() {
        const { data } = await axios.get(`/participate/${this.$route.params.survey_slug}`);        
        const { expired, result, survey, voted }: { expired: boolean, result: any[], survey: Survey, voted: boolean } = data;
        this.result = result;
        this.survey = survey;
        if(survey.unique)
            this.voted = voted;

        if(expired)
            this.expired = true;

        if(survey.final_sound)
            this.audio = new Audio(survey.final_sound);
    }

    get groupComplete(): boolean {
        let count = 0;
        this.survey.questions.forEach((question, index) => {
            if(this.groups[this.group] === question.group && (!this.votes[index] || (this.votes[index].justify && !this.votes[index].body))) {
                count++;
            }
        });      
        if(count > 0) return false;
        return true;
    }

    get hasNext() {
        return this.step < (this.survey.questions.length - 1);
    }

    get hasNextGroup(): boolean {        
        return this.group < (this.groups.length - 1);
    }

    get hasPreviousGroup(): boolean {
        return this.group > 0;
    }
    
    percentage(answer_id) {        
        const item = this.result.find(vote => vote.answer_id === answer_id);
        if(!item) return 0;        
        const votes = this.result.filter(vote => vote.question === item.question);
        const total = votes.reduce((carrier, current) => carrier += current.votes, 0);
        return (item.votes / total) * 100;
    }

    get question() {
        return this.survey.questions[this.step];
    }

    next() {     
        if(this.step < (this.survey.questions.length - 1)) this.step++;        
        this.step = this.survey.questions.length - 1;        
    }

    nextGroup() {        
        this.group++;
    }

    previousGroup() {        
        this.group--;
    }

    reset() {
        this.introduction = !!this.survey.introduction;
        this.voted = false;
        this.votes = [];
    }

    get selected() {
        return this.votes.map(vote => vote.answer_id);
    }

    share() {
        const options: any = {                    
            html: `<p>Compartilhe este link por e-mail ou mensagem instantânea:</p><textarea rows="3" style="width:100%">${window.location.href}</textarea>`,                          
        };       
        this.$swal(options);
    }

    setSelected(answer, index) {
        if(index) {
            const votes = [...this.votes];
            votes[index] = { answer_id: answer.id, question_id: answer.question_id, justify: answer.justify };        
            this.votes = votes;
            return;
        }
        const votes = [...this.votes];
        votes[this.step] = { answer_id: answer.id, question_id: answer.question_id, justify: answer.justify };        
        this.votes = votes;
    }

    get surveyComplete(): boolean {
        let count = 0;

        this.survey.questions.forEach((question, index) => {
            if(!this.votes[index] || (this.votes[index] && this.votes[index].justify && !this.votes[index].body)) count++;
        });

        return count === 0;
    }

    get URL() {
        return window.location.href;
    }

    async vote() {
        await axios.post(`/participate/${this.survey.slug}`, { 
            session_id: this.session_id,
            votes: this.votes
        });      
        this.loading = true;  
        const options: any = {        
            title: null,
            html: null,  
            timer: 5000,
            timerProgressBar: true,  
            onBeforeOpen: () => {
                if(this.audio) this.audio.play();
            },
            onClose: () => {
                this.loading = false
            }
        };
        if(!!this.survey.afterword)
            options.html = this.survey.afterword;
        else
            options.title = "Obrigado por participar da nossa enquete!";
        this.$swal(options);
        await this.getSurvey();
        this.voted = true;
    }
}
export default Political
</script>

<template lang="pug">
.text-center
    div(style="padding: 50px 0px")
        b-link(to="/" link)
            img(src="/images/logo.png" style="max-width: 100%")
    img(src="/images/spinner.gif" v-if="loading" style="max-width: 100%")
    div(v-if="!loading") 
        b-container
            b-row
                b-col(md=4 v-if="!!survey.description")
                    p(v-html="survey.description")
                b-col                    
                    b-row
                        b-col(v-if="voted || expired" xs=12)
                            div(v-for="question in survey.questions" :key="question.id")
                                b-list-group
                                    b-list-group-item(variant="dark")
                                        div(v-html="question.body")
                                    b-list-group-item(class="d-flex justify-content-between align-items-center" v-for="answer in question.answers" :key="answer.id")
                                        div.chart(:style="`background: rgba(32, 201, 15, .25);left: 0; height: 50px; position: absolute; width: ${percentage(answer.id)}%`")
                                        span 
                                            img(
                                                v-if="!!answer.image" 
                                                :src="answer.image.replace('public', 'storage')" 
                                                style="left: 5px; max-height: 40px; max-width: 50px; position: absolute; top: 5px;"
                                            )
                                            |  
                                            span(:style="`left: ${!!answer.image ? 50 : 0 }px; position: relative;`") {{ answer.body }}
                                        b-badge(variant="primary" pill) {{ percentage(answer.id).toFixed(2) }}%
                                br
                                br
                            div(class="m-t-1" v-if="!survey.unique")
                                b-button(v-on:click="reset" variant="primary") Votar Novamente
                            div(class="m-t-1")
                                b-button(class="m-t-1 wa-button" :href="`https://api.whatsapp.com/send?text=${URL}`" target="_blank" link) 
                                    v-icon(name="brands/whatsapp")
                                    span WhatsApp
                                |  
                                b-button(class="m-t-1 fb-button" :href="facebookURL" target="_blank" link)                                    
                                    v-icon(name="brands/facebook")
                                    span Postar
                                |  
                                b-button(class="m-t-1 dt-button" v-on:click="share") 
                                    v-icon(name="desktop")
                                    span Compartilhar
                        b-col(v-else)
                            b-card(v-if="introduction")
                                div(v-html="survey.introduction")
                                template(v-slot:footer)
                                    b-button(v-on:click="introduction = false" variant="success") Iniciar
                            template(v-else-if="!voted && question")
                                div(v-if="1 === survey.execution" deck)
                                    b-card(class="mb-4" v-for="question, index in survey.questions" :key="question.id")
                                        b-card-header(v-html="question.body")
                                        br
                                        b-card-group(deck)
                                            b-card(
                                                v-for="answer in question.answers"
                                                :bg-variant="selected.includes(answer.id) ? 'primary' : 'default'"
                                                class="text-center"
                                                title=""
                                                :img-src="answer.image && answer.image.replace('public', 'storage')"
                                                :img-alt="answer.body"
                                                img-top
                                                :key="answer.id"
                                                v-on:click="setSelected(answer, index)"
                                                tag="article"
                                                style="max-width: 20rem;"
                                                class="mb-2")
                                                    b-card-text {{ answer.body }}
                                                    b-button(:disabled="selected.includes(answer.id)" variant="success") Votar 
                                        div(v-if="votes[index] && !!votes[index].justify")
                                            b-form-group(label="Justificativa")         
                                                b-form-input(v-model="votes[index].body")
                                    b-card(class="text-center mb-4")                               
                                        b-button(:disabled="!surveyComplete" v-on:click="vote" v-if="!hasNextGroup" variant="success") Finalizar
                                div(v-if="2 === survey.execution" deck)
                                    b-card(class="mb-4" v-for="question, index in survey.questions" :key="question.id" v-if="groups[group] === question.group")
                                        b-card-header(v-html="question.body")
                                        br
                                        b-card-group(deck)
                                            b-card(
                                                v-for="answer in question.answers"
                                                :bg-variant="selected.includes(answer.id) ? 'primary' : 'default'"
                                                class="text-center"
                                                title=""
                                                :img-src="answer.image && answer.image.replace('public', 'storage')"
                                                :img-alt="answer.body"
                                                img-top
                                                :key="answer.id"
                                                v-on:click="setSelected(answer, index)"
                                                tag="article"
                                                style="max-width: 20rem;"
                                                class="mb-2")
                                                    b-card-text {{ answer.body }}
                                                    b-button(:disabled="selected.includes(answer.id)" variant="success") Votar 
                                        div(v-if="votes[index] && !!votes[index].justify")
                                            b-form-group(label="Justificativa")         
                                                b-form-input(v-model="votes[index].body")
                                    b-card(class="text-center mb-4")
                                        b-button(v-if="hasPreviousGroup" v-on:click="previousGroup") Voltar
                                        |  
                                        b-button(:disabled="!groupComplete" v-on:click="nextGroup" v-if="hasNextGroup" variant="success") Próximo
                                        |  
                                        b-button(:disabled="!groupComplete" v-on:click="vote" v-if="!hasNextGroup" variant="success") Finalizar
                                b-card(v-if="3 === survey.execution")                                
                                    b-card-header(v-html="question.body")
                                    br
                                    //- b-card-group(column)
                                    b-card(
                                        v-for="answer in question.answers"
                                        :bg-variant="selected.includes(answer.id) ? 'primary' : 'default'"
                                        class="text-center"
                                        no-body
                                        :key="answer.id"
                                        v-on:click="setSelected(answer)"
                                        tag="article"
                                        class="mb-2")
                                            b-row(align-v="center" no-gutters)
                                                b-col(sm="3" lg="1" v-if="answer.image")
                                                    b-card-img(:src="answer.image.replace('public', 'storage')" :alt="answer.body" class="rounded-0")
                                                b-col(sm="6")
                                                    .mb-2.mt-2
                                                        b-card-text {{ answer.body }}
                                                b-col(sm="3" lg="1")
                                                    .mb-2.mt-2
                                                        b-button(:disabled="selected.includes(answer.id)" variant="success") Votar 
                                    div(v-if="votes[step] && !!votes[step].justify")
                                        b-form-group(label="Justificativa")         
                                            b-form-input(v-model="votes[step].body")
                                    template(v-slot:footer)
                                        b-button(v-on:click="back" v-if="step > 0") Anterior
                                        |  
                                        b-button(v-on:click="next" :disabled="!votes[step] || (!!votes[step] && !!votes[step].justify && !votes[step].body)" v-if="hasNext" variant="success") Próximo
                                        b-button(v-on:click="vote" :disabled="!votes[step] || (!!votes[step] && !!votes[step].justify && !votes[step].body)" v-else variant="success") Finalizar
                            b-card(v-else-if="!survey.questions.length")
                                p Empty
                            b-card(v-else)
                                p Not Found
</template>

<style>
html,
body {
    background: whitesmoke;
    width: 100%;
}
.card:hover {
    cursor: pointer;
}
.card.bg-primary:hover {
    cursor: initial;
}
.card.bg-primary {
    background-color: rgb(0, 123, 255, .5);
    color: white;
}
</style>

<style scoped>
.fb-button {
    background-color: #3b5998;
}
.fa-icon {
    margin-right: 5px;
}
.fb-button:hover {
    background-color: #2d4373
}
.m-t-1 {
    margin-top: 10px;    
}
.wa-button {
    background-color: #25d366;
}
.wa-button:hover {
    background-color: #21bd5c;
}
</style>
