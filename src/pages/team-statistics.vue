<template>
  <f7-page>
      <f7-navbar title="Statistics" back-link="Back"></f7-navbar>
    <!-- <f7-list media-list>
      <f7-list-item
        class="player-card theme-light"
        :class="teamColor(team.name)" 
        :title="team.name"
        :subtitle="goals"
        :text="player.date_of_birth"
        :after="'#' + player.shirt_number"
        @click="playerStats(player)"
      >
      

      </f7-list-item>
    </f7-list>-->
    <f7-card>
      <f7-card-header class="cardHeader">Team name U1</f7-card-header>
      <f7-card-content>
        <div>Goals: 24</div>
        <div>Yellow cards: 35</div>
        <div>Red cards: 5</div>
      </f7-card-content>
    </f7-card>
  </f7-page>
</template>
<script>
const firebase = require("firebase/app");

require("firebase/database");

export default {
  data() {
    return {};
  },
  computed: {},
  methods: {
    teamStats: async function() {
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
</style>
