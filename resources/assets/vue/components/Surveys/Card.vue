<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Card extends Vue {
  @Prop() survey: any;
}
</script>

<template lang="pug">
b-card.users-card.mb-3(no-body)
  h4(slot="header") {{ survey.name }}

  b-card-body
    p.card-text
      span.font-weight-bold {{ $t('strings.name') }}:
      | &nbsp;{{ survey.name }}
      br/
      span.font-weight-bold {{ $t('strings.created_at') }}:
      | &nbsp;{{ survey.created_at }}

  b-card-footer
    b-button(@click="$emit('edit-survey')", variant="link")
      v-icon(name="pencil-alt")
      | &nbsp;{{ $t('buttons.edit') }}

    b-button(
      @click="$emit('show-questions')",      
      variant="link"
    )
      v-icon(name="clipboard-list")
      | &nbsp;{{ $t('strings.questions') }}
</template>

<style lang="scss" scoped>
.card-footer {
  display: flex;
  justify-content: flex-end;
  button {
    display: flex;
    align-items: center;
  }
}
</style>
