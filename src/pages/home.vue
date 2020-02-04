<template>
  <f7-page id="main" name="home">
    <!-- Top Navbar -->
    <f7-navbar :sliding="false" large>
      <f7-nav-left>
        <f7-link
          icon-ios="f7:menu"
          icon-aurora="f7:menu"
          icon-md="material:menu"
          panel-open="left"
        ></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>NYSL</f7-nav-title>

      <f7-nav-title-large sliding>NYSL</f7-nav-title-large>
      <f7-nav-right>
        <f7-link
          v-if="!isSignedIn"
          icon-ios="f7:contact"
          icon-aurora="f7:person"
          icon-md="material:person"
          fill
          raised
          login-screen-open="#login-screen"
          >Log-In
        </f7-link>
        <f7-link @click="logout" v-else>Logout</f7-link>
      </f7-nav-right>
    </f7-navbar>

    <!-- Page content-->
    <f7-block-title>Upcoming matches</f7-block-title>
    <f7-block strong class="matches">
      <match-card
        v-for="match in upcomingMatches"
        :key="match.key"
        :match="match"
        :teamOne="getMatchTeam(Object.keys(match)[0])"
        :teamTwo="getMatchTeam(Object.keys(match)[1])"
      />
    </f7-block>
  </f7-page>
</template>
<script>
import matchCard from "../components/match-card.vue";
const firebase = require("../js/firebase");

export default {
  data() {
    return {
      upcomingMatches: [],
      playerNames: [],
      teams: [],
      isSignedIn: false,
      auth: firebase.auth()
    };
  },
  components: {
    matchCard
  },
  watch: {
    // ?offline
    // aware of bug that it keeps populating upcoming matches with same data
    isConnected: function() {
      if (this.isConnected) {
        this.getData();
      }
    }
  },
  methods: {
    getMatchTeam: function(teamKey) {
      return this.teams.find(team => {
        return team.key === teamKey;
      });
    },
    logout: function() {
      if (this.isSignedIn) {
        this.auth.signOut();
        this.isSignedIn = false;
      }
    },
    // ?offline
    getData: async function() {
      const db = firebase.database();

      // get current date and format it
      const date = new Date(Date.now());
      let month = "" + (date.getMonth() + 1),
        day = "" + (date.getDate() + 1), // get a day later for query
        year = date.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;
      const formattedDate = [year, month, day].join("-");

      // get 3 upcoming matches
      await db
        .ref("/matches/")
        .orderByChild("match_date")
        .startAt(formattedDate)
        .limitToFirst(4)
        .once("value")
        .then(matchesSnapshot => {
          matchesSnapshot.forEach(matchSnapshot => {
            // push upcoming matches to array
            const match = matchSnapshot.val();
            this.upcomingMatches.push(match);
          });
        });

      // get 10 player names;
      const playerNames = [];
      await db
        .ref("players")
        .orderByChild("first_name")
        .limitToFirst(11)
        .once("value")
        .then(snapshot => {
          snapshot.forEach(playerSnapshot => {
            const player = playerSnapshot.val();
            const playerName = player.first_name + " " + player.last_name;
            this.playerNames.push(playerName);
          });
        });

      // get all teams to know which team plays which match
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
  }
};
</script>
<style>
.matches {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  background-color: #efeff4;
}
</style>
