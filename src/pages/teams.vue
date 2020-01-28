<template>
  <f7-page name="teams">
    <f7-navbar title="Teams" back-link="Back"></f7-navbar>
    <f7-block-title>Teams</f7-block-title>
    <team-card v-for= "team in teams" :key="team.key"
     :team="team"/>
  </f7-page>
</template>
<script>
import teamCard from "../components/team-card.vue";
const firebase = require("firebase/app");

require("firebase/database");

export default {
  data() {
      

    return {
        teams:[],
    };
  },
  components: {
    teamCard
  },
  created: async function(){
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
  }
};
</script>
