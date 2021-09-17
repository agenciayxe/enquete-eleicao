<script lang="ts">
import axios from "axios";
import { v4 as uuid } from "uuid";
import { Component, Vue, Watch } from "vue-property-decorator";

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import Political from "@/components/Participate/Political.vue";

Vue.use(VueSweetalert2);

@Component({
    components: {
        Political,
    },
    metaInfo() {
        return { 
            title: "Enquete 2020",
            meta: [
                { name: 'app-name', content:  'Analyze Política' },
                { property: 'og:title', content: 'Participe do processo democrático, dê a sua opinião!' },
                { property: 'og:site_name', content: 'Analyze Política' },
                {property: 'og:type', content: 'website' },    
                { name: 'robots', content: 'index,follow' } 
            ]
        }
    }
})
export default class Participate extends Vue {

    data: any = null;

    async created() {       
        await this.getSurvey();
    }

    async getSurvey() {
        const { data } = await axios.get(`/participate/${this.$route.params.survey_slug}`);
        this.data = data;
    }


}
</script>

<template lang="pug">
div.text-center
    template(v-if="data")
        political(:data="data" :get-survey="getSurvey" v-on:get-survey="getSurvey")
</template>