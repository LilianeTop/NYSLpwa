<template>
  <f7-page name="game-schedule">
    <f7-navbar title="Game Schedule" back-link="Back"></f7-navbar>
    <f7-block-title>Upcoming Events</f7-block-title>
    <f7-block strong>
      <div class="matches">
        <matchCard v-for="match in matches" :key="match.key" :matchDate="match.match_date" :teams="getTeams(Object.keys(match)[0], Object.keys(match)[1])"/>
      </div>
    </f7-block>
  </f7-page>
</template>
<script>
import matchCard from "../components/match-card.vue";
const firebase = require("firebase/app");

require("firebase/database");

export default {
  data() {
    return {
      matches: [],
      teams: []
    };
  },
  components: {
    matchCard
  },
  created: async function() {
    const db = firebase.database();
    await db
      .ref("/matches/")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(snapshot => {
          const match = snapshot.val();
          this.matches.push(match);
        });
      });

    await db
      .ref("/teams/")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(snapshot => {
          const team = snapshot.val();
          this.teams.push(team);
        });
      });

    this.matches.sort((a, b) => {
      return new Date(a.match_date) - new Date(b.match_date);
    });

    this.matches = this.matches.filter(match => {
      return new Date(match.match_date) > Date.now();
    });
  },
  methods: {
    getTeams: function(team1key, team2key) {
      const teams = [];
      const team1 = this.teams.find(team => {
        return team.key === team1key;
      });
      const team2 = this.teams.find(team => {
        return team.key === team2key;
      })
      teams.push(team1);
      teams.push(team2);
     return teams;
    }
  }
};
</script>
<style scoped>
.matches {
  display: flex;
  flex-wrap: wrap;
}
</style>