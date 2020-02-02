<template>
  <f7-page name="teams">
    <f7-navbar title="Teams" back-link="Back"></f7-navbar>
    <f7-block-title>Teams</f7-block-title>
    <f7-list>
      <team-card
        v-for="team in teams"
        :key="team.key"
        :team="team"
        :openStatistics="openStatistics"
      />
    </f7-list>

    <f7-sheet
      :opened="statisticsOpened"
      @sheet:closed="statisticsOpened = false"
    >
      <f7-toolbar>
        <div class="center">{{ clickedTeam.name }}</div>
        <div class="right">
          <f7-link sheet-close>X</f7-link>
        </div>
      </f7-toolbar>
      <f7-page-content>
        <div>Total goals: {{ goalsTotal }}</div>
        <div>Total yellow cards: {{ yellowCardsTotal }}</div>
        <div>Total red cards: {{ redCardsTotal }}</div>
      </f7-page-content>
    </f7-sheet>
  </f7-page>
</template>
<script>
import teamCard from "../components/team-card.vue";
const firebase = require("firebase/app");

let db;

export default {
  data() {
    return {
      teams: [],
      statisticsOpened: false,
      goalsTotal: 0,
      yellowCardsTotal: 0,
      redCardsTotal: 0,
      clickedTeam: {}
    };
  },
  components: {
    teamCard
  },
  methods: {
    openStatistics: async function(clickedTeam) {
      this.clickedTeam = clickedTeam;
      this.statisticsOpened = true;
      let goalsTotal = 0;
      let yellowCardsTotal = 0;
      let redCardsTotal = 0;

      await db
        .ref("/matches/")
        .once("value")
        .then(matches => {
          matches.forEach(match => {
            const team = match.child(clickedTeam.key).val();
            if (team) {
              for (let players in team) {
                if (typeof team[players] === "object") {
                  // console.log(team[players])
                  goalsTotal += team[players].goals;
                  yellowCardsTotal += team[players].yellow_cards;
                  redCardsTotal += team[players].red_card;
                }
              }
            }
            this.goalsTotal = goalsTotal;
            this.yellowCardsTotal = yellowCardsTotal;
            this.redCardsTotal = redCardsTotal;
            // console.log(this.goalsTotal);
          });
        });
    }
  },
  created: async function() {
    db = firebase.database();

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

<style scoped>
center {
  align-self: center;
}
</style>
