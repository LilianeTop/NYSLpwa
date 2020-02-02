<template>
  <f7-page name="team-players">
    <f7-navbar title="Players" back-link="Back"></f7-navbar>
    <f7-block class="team-list">
      <player-card
        v-for="team in teams"
        :key="team.key"
        :team="team"
        :loading="loading"
      />
    </f7-block>
  </f7-page>
</template>
<script>
import playerCard from "../components/player-card.vue";
const firebase = require("firebase/app");

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
    const teamRef = db.ref("/teams/");

    this.loading = true;

    if (teamId) {
      await teamRef
        .orderByKey()
        .equalTo(teamId)
        .once("value")
        .then(snapshot => {
          snapshot.forEach(team => {
            const teamValue = team.val();
            console.log("team", teamValue);
            this.teams.push(teamValue);
          });
        });
      // console.log(team);
    } else {
      await teamRef.once("value").then(snapshot => {
        snapshot.forEach(snapshot => {
          const team = snapshot.val();
          this.teams.push(team);
        });
      });
    }
    // join players with team
    await db
      .ref("/players/")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(snapshot => {
          const player = snapshot.val();
          this.players.push(player);
        });
      });

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
  flex-wrap: wrap
}
</style>
