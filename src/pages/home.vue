<template>
  <f7-page bg-color='teal' id="main" name="home">
    <!-- Top Navbar -->
    <f7-navbar :sliding="false" large>
      <!-- open navigation with hamburger -->
      <f7-nav-left>
        <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <!-- logo title -->
      <f7-nav-title sliding>
        <div class="logo">NYSL</div>
      </f7-nav-title>
      <f7-nav-title-large sliding>
        <div class="logo">NYSL</div>
      </f7-nav-title-large>
      <!-- log in button -->
      <f7-nav-right>
        <f7-link
          v-if="!isSignedIn"
          icon-ios="f7:contact"
          icon-aurora="f7:person"
          icon-md="material:person"
          fill
          raised
          login-screen-open="#login-screen"
        >Log-In</f7-link>
        <f7-link @click="logout" v-else>Logout</f7-link>
      </f7-nav-right>
    </f7-navbar>

    <!-- upcoming matches-->
    <f7-block-title class="header">Upcoming matches</f7-block-title>
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
      playerNames: this.$f7route.context.playerNames,
      teams: [],
      auth: firebase.auth()
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
    });
  },
  methods: {
    getMatchTeam: function(teamKey) {
      return this.teams.find(team => {
        return team.key === teamKey;
      });
    },
    logout() {
      if (this.isSignedIn) {
        this.auth.signOut();
      }
    }
  }
};
</script>
<style>
.logo {
  border: 2px double green;
  border-radius: 50%;
  background-color: greenyellow;
  color: white;
  display: inline-block;
  padding: 10px 5px;
  font-size: 20px;
  text-shadow: 1px 2px green;
  font-family: fantasy;
  font-weight: 800;
}
</style>
