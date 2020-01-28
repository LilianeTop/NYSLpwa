<template>
  <f7-card class="match-card">
    <f7-card-header>
      <i class="far fa-futbol"></i>
      <h4>{{teams[0].name}} - {{teams[1].name}}</h4>
      <i class="far fa-futbol"></i>
    </f7-card-header>
    <f7-card-content>
      <p>Date: {{ matchDate }}</p>
      <p>Location:</p>
    </f7-card-content>
  </f7-card>
</template>


<script>
export default {
    props: ['matchDate', 'teams']
};
</script>

<style scoped>
.match-card {
  align-content: center;
  min-width: 250px;
}
</style>