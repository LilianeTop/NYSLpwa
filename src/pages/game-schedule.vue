<template>
  <f7-page name="game-schedule">
    <f7-navbar :title="navbarTitle" back-link="Back"></f7-navbar>
    <f7-block-title>Upcoming Events</f7-block-title>
    <f7-block strong class="matches">
      <match-card
        v-for="match in upcomingMatches"
        :key="match.key"
        :match="match"
        :teamOne="getMatchTeam(Object.keys(match)[0])"
        :teamTwo="getMatchTeam(Object.keys(match)[1])"
      />
    </f7-block>
    <div v-if="playedMatches && playedMatches.length > 0">
      <f7-block-title>Match History</f7-block-title>
      <f7-block strong class="matches">
        <match-card
          v-for="match in playedMatches"
          :key="match.key"
          :match="match"
          :teamOne="getMatchTeam(Object.keys(match)[0])"
          :teamTwo="getMatchTeam(Object.keys(match)[1])"
        />
      </f7-block>
    </div>
  </f7-page>
</template>
<script>
import matchCard from "../components/match-card.vue";
const firebase = require("../js/firebase");

export default {
  data() {
    return {
      upcomingMatches: this.$f7route.context.upcomingMatches,
      playedMatches: this.$f7route.context.playedMatches,
      teams: []
    };
  },
  components: {
    matchCard
  },
  created: async function() {
    const db = firebase.database();
    await db
      .ref("/teams/")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(snapshot => {
          const team = snapshot.val();
          this.teams.push(team);
        });
      });
  },
  computed: {
    navbarTitle: function() {
      const teamId = this.$f7route.params.teamId;
      if (teamId) {
        const team = this.getMatchTeam(teamId);
        if (team) return `Game schedule from ${team.name}`;
      } else return "Game schedule";
    }
  },
  methods: {
    getMatchTeam: function(teamKey) {
      return this.teams.find(team => {
        return team.key === teamKey;
      });
    }
  }
};
</script>
<style scoped>
.matches {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  background-color: #efeff4;
}
</style>
