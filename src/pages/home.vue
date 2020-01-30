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
        <f7-link v-else>Logout</f7-link>
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
      upcomingMatches: this.$f7route.context.upcomingMatches,
      teams: [],
      isSignedIn: false
    };
  },
  components: {
    matchCard
  },
  created: async function() {
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
  },
  mounted() {
    this.$f7ready(f7 => {
      this.isSignedIn = f7.isSignedIn;
    });
  },
  methods: {
    getMatchTeam: function(teamKey) {
      return this.teams.find(team => {
        return team.key === teamKey;
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
