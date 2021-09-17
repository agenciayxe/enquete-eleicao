<script lang="ts">
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';

@Component({
     metaInfo() {
        return { 
            title: "Enquete 2020",
            meta: [
                { name: 'app-name', content:  'Enquete 2020'},
                { property: 'og:title', content: "Enquete 2020"},
    //         //     { property: 'og:site_name', content: 'Epiloge'},
    //         //     {property: 'og:type', content: 'website'},    
    //         //     {name: 'robots', content: 'index,follow'} 
            ]
        }
    }
})
export default class Home extends Vue {

    surveys: Survey[] = [];

    async created(): Promise<void> {
        const { data } = await axios.get(`home`);
        this.surveys = data;
    }

    navigate(survey_slug): string {
        return this.$router.resolve({
            name: "participate",
            params: { survey_slug }
        }).href;
    }

}
</script>

<template lang="pug">
b-container
    div.text-center
        img(src="/images/logo.png")
    
    b-card-group(deck)
        b-link.mt-4(v-for="survey in surveys" :key="survey.id" :to="navigate(survey.slug)")
            b-card(
                class="mb-3"                
                :key="survey.id" 
                :img-src="survey.cover || 'https://via.placeholder.com/1920x700.png?text=Enquete'" 
                :img-alt="survey.name" 
                overlay
                text-variant="white"
                :title="survey.name"             
            )
                b-card-text 
                    p {{ survey.description }}
</template>

<style>
.card img {
    max-height: 700px !important;
}
</style>