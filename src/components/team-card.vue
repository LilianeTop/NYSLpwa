<template>
  <div>
    <f7-card>
      <f7-card-header class="cardHeader" :class="teamColor(team.name)">
        {{ team.name }}
      </f7-card-header>
      <f7-card-content></f7-card-content>
      <f7-card-footer>
        <f7-link :href="teamUrlPlayers" text="players"></f7-link>
        <f7-link @click="openStatistics(team)" text="statistics"></f7-link>
        <f7-link :href="teamUrlSchedule" text="schedule"></f7-link>
      </f7-card-footer>
    </f7-card>
  </div>
</template>
<script>
export default {
  props: ["team", "openStatistics"],
  computed: {
    teamUrlPlayers: function() {
      return `/${this.team.key}/players/`;
    },
    teamUrlSchedule: function() {
      return `/game-schedule/${this.team.key}/`;
    }
  }
};
</script>

<style scoped>
.card-header {
  justify-content: center;
  color: white;
  border-bottom: 1px solid white;
}
</style>
