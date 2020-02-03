<template>
  <f7-page bg-color="teal" name="teams">
    <f7-navbar title="Teams" back-link="Back"></f7-navbar>
    <f7-list class="team-list">
      <team-card
        class="team-card"
        v-for="team in teams"
        :key="team.key"
        :team="team"
        :openStatistics="openStatistics"
      />
    </f7-list>
    <!-- statistic sheet -->
    <f7-sheet :opened="statisticsOpened" @sheet:closed="statisticsOpened = false">
      <f7-toolbar :class="teamColor(clickedTeam.name)">
        <div class="statistics-header">{{ clickedTeam.name }}</div>
        <div>
          <f7-link style="color: white" sheet-close>X</f7-link>
        </div>
      </f7-toolbar>
      <f7-page-content class="center-text">
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

require("firebase/database");
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

      // retrieve all matches from firebase and iterate over every player in that team
      await db
        .ref("/matches/")
        .once("value")
        .then(matchesSnapshot => {
          // iterate through every match
          matchesSnapshot.forEach(matchSnapshot => {
            // get the requested team statistics
            const team = matchSnapshot.child(clickedTeam.key).val();
            if (team) {
              // iterate over players in team
              for (let players in team) {
                if (typeof team[players] === "object") {
                  // counting the totals
                  goalsTotal += team[players].goals;
                  yellowCardsTotal += team[players].yellow_cards;
                  redCardsTotal += team[players].red_card;
                }
              }
            }
            // assigning the totals to team totals
            this.goalsTotal = goalsTotal;
            this.yellowCardsTotal = yellowCardsTotal;
            this.redCardsTotal = redCardsTotal;
          });
        });
    }
  },
  created: async function() {
    db = firebase.database();
    // get all teams from firebase
    await db
      .ref("/teams/")
      .once("value")
      .then(teamsSnapshot => {
        teamsSnapshot.forEach(teamSnapshot => {
          const team = teamSnapshot.val();
          // push team from firebase to teams array
          this.teams.push(team);
        });
      });
  }
};
</script>

<style scoped>
.team-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  background-color: #9cd6ad;
  padding: 20px 0;
}
.team-card {
  min-width: 400px;
}
.statistics-header {
  width: 100%;
  text-align: center;
  padding-left: 35px;
  color: white;
  font-weight: bold;
  font-size: 16px;
}
.center-text {
  text-align: center;
  padding-top: 30px;
  font-size: 18px;
}
</style>
