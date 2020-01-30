<template>
  <f7-card class="match-card">
    <f7-card-header v-if="!isPlayedMatch">
      <i class="far fa-futbol"></i>
      <span class="bold" v-if="teamOne && teamTwo">
        {{ teamOne.name }} - {{ teamTwo.name }}
      </span>
      <i class="far fa-futbol"></i>
    </f7-card-header>
    <!-- Header for matches that have been played -->
    <f7-card-header class="match-header" v-else>
      <div v-if="teamOne && teamTwo">
        <f7-row
          :class="{ bold: teamScore(teamOne) > teamScore(teamTwo) }"
          id="teamOneRow"
        >
          <f7-col>{{ teamOne.name }}</f7-col>
          <f7-col style="text-align: end;">{{ teamScore(teamOne) }}</f7-col>
        </f7-row>
        <f7-row
          :class="{ bold: teamScore(teamTwo) > teamScore(teamOne) }"
          id="teamTwoRow"
        >
          <f7-col>{{ teamTwo.name }}</f7-col>
          <f7-col style="text-align: end;">{{ teamScore(teamTwo) }}</f7-col>
        </f7-row>
      </div>
    </f7-card-header>
    <f7-card-content>
      <p>Date: {{ match.match_date }}</p>
    </f7-card-content>
  </f7-card>
</template>

<script>
export default {
  props: ["match", "teamOne", "teamTwo"],
  computed: {
    isPlayedMatch: function() {
      return new Date(this.match.match_date) < Date.now();
    }
  },
  methods: {
    teamScore: function(teamToGetGoalsFrom) {
      const team = this.match[teamToGetGoalsFrom.key];
      let goals = 0;
      for (let playerKeys in team) {
        if (typeof team[playerKeys] === "object") {
          const player = team[playerKeys];
          goals += player.goals;
        }
      }
      return goals;
    }
  }
};
</script>

<style scoped>
.match-card {
  align-content: center;
  min-width: 200px;
}
.match-header {
  display: block;
}
.bold {
  font-weight: bold;
}

.align-end {
  text-align: end;
}
</style>
