<template>
  <f7-page name="allplayers">
    <f7-navbar title="Players" back-link="Back"></f7-navbar>
    <f7-block>
      <f7-block-title>Team1</f7-block-title>
      <f7-list media-list>
      <player-card  v-for="player in players" :key="player.key" :player="player" />
      </f7-list>
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
      players: []
    };
  },
  components: {
    playerCard
  },
  created: async function() {
    const db = firebase.database();
    await db
      .ref("/players/")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(snapshot => {
          const player = snapshot.val();
          this.players.push(player);
        });
      });
  }
};
</script>
