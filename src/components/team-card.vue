<template>
  <f7-card>
    <f7-card-header class="cardHeader">{{ team.name }}</f7-card-header>
    <f7-card-content>
      
    </f7-card-content>
    <f7-card-footer>
      <f7-link href="/players/" text="players"></f7-link>
      <f7-link href="#" text="statistics"></f7-link>
      <f7-link href="/game-schedule/" text="schedule"></f7-link>
    </f7-card-footer>
  </f7-card>
</template>
<script>
export default {
  props: ["team"]
};
</script>

<style scoped>
.cardHeader {
  justify-content: center;

  color: green;
}
</style>
