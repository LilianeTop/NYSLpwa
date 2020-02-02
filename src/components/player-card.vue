<template>
  <div>
    <f7-block-title>{{ team.name }}</f7-block-title>
    <f7-list
      media-list
      v-if="loading"
      class="skeleton-text skeleton-effect-fade"
    >
      <f7-list-item
        v-for="n in 11"
        :key="n"
        class="player-card"
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
    <f7-list media-list v-else>
      <f7-list-item
        class="player-card theme-light"
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
        <f7-accordion-content :player="player">
          <hr />
          <div>Goals: {{ player.goals_total }}</div>
          <div>Yellow cards: {{ player.yellow_cards_total }}</div>
          <div>Red cards: {{ player.red_cards_total }}</div>
        </f7-accordion-content>
        <img
          class="profile-img"
          src="https://placeimg.com/80/80/people/1"
          slot="media"
        />
      </f7-list-item>
    </f7-list>
  </div>
</template>
<script>
const firebase = require("firebase/app");

export default {
  props: ["team", "loading"],
  data() {
    return {};
  },
  computed: {
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
    playerStats: async function(clickedPlayer) {
      let goalsTotal = 0;
      let yellowCardsTotal = 0;
      let redCardsTotal = 0;

      const db = firebase.database();
      await db
        .ref("/matches/")
        .once("value")
        .then(matches => {
          matches.forEach(match => {
            const player = match
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
              console.log(player, goalsTotal);
            }
            clickedPlayer["goals_total"] = goalsTotal;
            clickedPlayer["yellow_cards_total"] = yellowCardsTotal;
            clickedPlayer["red_cards_total"] = redCardsTotal;
          });
        });

      this.$forceUpdate();
    }
  }
};
</script>

<style scoped>
.player-list {
  display: flex;
}

.player-card {
  margin: 5px 0;
  padding: 20px;
}

.profile-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>
