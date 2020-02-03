<template>
  <div>
    <f7-block-title class="header">{{ team.name }}</f7-block-title>
    <!-- loading effect for players -->
    <f7-list media-list v-if="loading">
      <f7-list-item
        v-for="n in 11"
        :key="n"
        class="player-card skeleton-text skeleton-effect-fade"
        :class="teamColor('U1')"
        accordion-item
        title="Full name"
        subtitle="Position"
        text="7777-77-77"
        after="44"
      >
        <f7-skeleton-block class="profile-img" slot="media"></f7-skeleton-block>
      </f7-list-item>
    </f7-list>
    <!-- actual list for when players are done loading -->
    <f7-list  media-list v-else>
      <f7-list-item
        class="player-card"
        :class="teamColor(team.name)"
        accordion-item
        v-for="player in teamPlayers"
        :key="player.key"
        :title="player.first_name + ' ' + player.last_name"
        :subtitle="capitalizePosition(player.position)"
        :text="player.date_of_birth"
        :after="'#' + player.shirt_number"
        @click="playerStats(player)"
      >
      <!-- expand to see player's statistics -->
        <f7-accordion-content :player="player">
          <hr />
          <div>Goals: {{ player.goals_total }}</div>
          <div>Yellow cards: {{ player.yellow_cards_total }}</div>
          <div>Red cards: {{ player.red_cards_total }}</div>
        </f7-accordion-content>
        <img class="profile-img" src="https://placeimg.com/80/80/people/1" slot="media" />
      </f7-list-item>
    </f7-list>
  </div>
</template>
<script>
const firebase = require("firebase/app");
require("firebase/database");

export default {
  props: ["team", "loading"],
  computed: {
    // used to filter non-player objects
    teamPlayers: function() {
      const teamPlayers = [];
      const team = this.team;
      for (let player in team) {
        if (typeof team[player] === "object") {
          teamPlayers.push(team[player]);
        }
      }
      return teamPlayers;
    }
  },
  methods: {
    capitalizePosition: function(position) {
      if (!position) return;
      const capitilized =
        position.charAt(0).toUpperCase() + position.substring(1);
      return capitilized;
    },
    // calculate player's statistics after clicking
    playerStats: async function(clickedPlayer) {
      let goalsTotal = 0;
      let yellowCardsTotal = 0;
      let redCardsTotal = 0;

      const db = firebase.database();
      await db
        .ref("/matches/")
        .once("value")
        .then(matchesSnapshot => {
          matchesSnapshot.forEach(matchSnapshot => {
            const player = matchSnapshot
              .child(this.team.key)
              .child(clickedPlayer.key)
              .val();
            if (player) {
              for (let stats in player) {
                switch (stats) {
                  case "goals":
                    goalsTotal += player[stats];
                    break;
                  case "yellow_cards":
                    yellowCardsTotal += player[stats];
                    break;
                  case "red_card":
                    redCardsTotal += player[stats];
                    break;
                }
              }
            }
            clickedPlayer["goals_total"] = goalsTotal;
            clickedPlayer["yellow_cards_total"] = yellowCardsTotal;
            clickedPlayer["red_cards_total"] = redCardsTotal;
          });
        });
// required for updates
      this.$forceUpdate();
    }
  }
};
</script>

<style scoped>
.player-card {
  border-bottom: 4px solid teal;
  padding: 20px;
  width: 350px;
  font-family: "arial black";
}

.profile-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>
