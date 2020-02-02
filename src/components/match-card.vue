<template>
  <f7-card class="match-card" v-if="teamOne && teamTwo">
    <f7-card-header class="match-upcoming-header" v-if="!isPlayedMatch">
      <div class="teams team-left" :class="teamColor(teamOne.name)">
        <f7-link class="bold" :href="`/game-schedule/${teamOne.key}`">
          <i class="far fa-futbol"></i>
          &nbsp;{{ teamOne.name }}
        </f7-link>
      </div>
      <div class="teams team-right" :class="teamColor(teamTwo.name)">
        <f7-link class="bold" :href="`/game-schedule/${teamTwo.key}`">
          <i class="far fa-futbol"></i>
          &nbsp;{{ teamTwo.name }}
        </f7-link>
      </div>
    </f7-card-header>
    <!-- Header for matches that have been played -->
    <f7-card-header class="match-history-header" v-else>
      <div>
        <f7-row
          :class="[
            (teamScore(teamOne) > teamScore(teamTwo) ? 'bold' : '',
            teamColor(teamOne.name))
          ]"
          class="team-one-row"
          id="teamOneRow"
        >
          <f7-col>{{ teamOne.name }}</f7-col>
          <f7-col style="text-align: end;">{{ teamScore(teamOne) }}</f7-col>
        </f7-row>
        <f7-row
          :class="[
            (teamScore(teamTwo) > teamScore(teamOne) ? 'bold' : '',
            teamColor(teamTwo.name))
          ]"
          class="team-two-row"
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
.match-upcoming-header {
  justify-content: space-between;
  padding: 0;
}
.teams {
  flex-grow: 1;
  align-self: stretch;
  display: flex;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  color: white;
}
.team-left {
  border-right: 1px solid white;
}
.team-right {
  border-left: 1px solid white;
}

.match-history-header {
  display: block;
  padding: 0;
}

.bold {
  font-weight: bold;
  color: white;
}

.team-one-row {
  padding: 4px 12px 2px 12px;
  color: white;
  border-bottom: 1px solid white;
}

.team-two-row {
  padding: 2px 12px 4px 12px;
  color: white;
}
</style>
