<template>
  <div>
    <f7-block-title>{{ team.name }}</f7-block-title>
    <f7-list media-list>
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
        <img class="profile-img" src="https://placeimg.com/80/80/people/1" slot="media" />
      </f7-list-item>
    </f7-list>
  </div>
</template>
<script>
const firebase = require("firebase/app");

require("firebase/database");

export default {
  props: ["team"],
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
      this.popupOpened = true;
      // this.playerPopup = player;
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
    },
    teamColor: function(teamName) {
      switch (teamName) {
        case "U1":
          return "player-card-U1";
        case "U2":
          return "player-card-U2";
        case "U3":
          return "player-card-U3";
        case "U4":
          return "player-card-U4";
        case "U5":
          return "player-card-U5";
        case "U6":
          return "player-card-U6";
      }
    }
  }
};
</script>

<style scoped>
.player-card {
  margin: 5px 0;
  padding: 20px;
}
.player-card-U1 {
  background-color: rgb(230, 69, 69);
}
.player-card-U2 {
  background-color: rgb(19, 199, 199);
}
.player-card-U3 {
  background-color: rgb(195, 107, 206);
}
.player-card-U4 {
  background-color: rgb(147, 199, 16);
}
.player-card-U5 {
  background-color: rgb(175, 88, 88);
}
.player-card-U6 {
  background-color: rgb(140, 133, 208);
}

.profile-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>
