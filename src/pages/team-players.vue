<template>
  <f7-page bg-color="teal" name="team-players">
    <f7-navbar title="Players" back-link="Back"></f7-navbar>
    <f7-block class="team-list">
      <!-- all the players from team -->
      <player-card v-for="team in teams" :key="team.key" :team="team" :loading="loading" />
    </f7-block>
  </f7-page>
</template>
<script>
import playerCard from "../components/player-card.vue";
const firebase = require("firebase/app");

require("firebase/database");

export default {
  data() {
    return {
      players: [],
      teams: [],
      loading: false
    };
  },
  components: {
    playerCard
  },
  created: async function() {
    const teamId = this.$f7route.params.teamId;
    const db = firebase.database();

    this.loading = true;

    // get a single team from firebase based on teamId
    if (teamId) {
      await db
        .ref("/teams/")
        .orderByKey()
        .equalTo(teamId)
        .once("value")
        .then(teamsSnapshot => {
          teamsSnapshot.forEach(teamSnapshot => {
            const team = teamSnapshot.val();
            this.teams.push(team);
          });
        });
    } else {
      // get all teams from firebase
      await db
        .ref("/teams/")
        .once("value")
        .then(teamsSnapshot => {
          teamsSnapshot.forEach(teamSnapshot => {
            const team = teamSnapshot.val();
            this.teams.push(team);
          });
        });
    }
    // get all players from firebase
    await db
      .ref("/players/")
      .once("value")
      .then(playersSnapshot => {
        playersSnapshot.forEach(playerSnapshot => {
          const player = playerSnapshot.val();
          this.players.push(player);
        });
      });

    // join players with team, bug adds non-player-object to team
    this.teams.forEach(team => {
      for (let playerKey in team) {
        this.players.forEach(player => {
          if (playerKey === player.key) {
            team[playerKey] = player;
          }
        });
      }
    });
    this.loading = false;
  }
};
</script>
<style scoped>
.team-list {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}
</style>
