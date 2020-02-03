import HomePage from "../pages/home.vue";
import GameSchedulePage from "../pages/game-schedule.vue";
import TeamsPage from "../pages/teams.vue";
import TeamPlayersPage from "../pages/team-players.vue";
import ChatPage from "../pages/firechat.vue";
import NotFoundPage from "../pages/404.vue";

const firebase = require("./firebase");
const db = firebase.database();

// get current date and format it
function getFormattedDate() {
  const date = new Date(Date.now());
  let month = "" + (date.getMonth() + 1),
    day = "" + (date.getDate() + 1), // get a day later for query
    year = date.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("-");
}

var routes = [{
    path: "/",
    alias: "/home/",
    async: async function (routeTo, routeFrom, resolve, reject) {
      const upcomingMatches = [];

      const formattedDate = getFormattedDate();

      // get 6 upcoming matches
      await db
        .ref("/matches/")
        .orderByChild("match_date")
        .startAt(formattedDate)
        .limitToFirst(6)
        .once("value")
        .then(matchesSnapshot => {
          matchesSnapshot.forEach(matchSnapshot => {
            // push upcoming matches to array
            const match = matchSnapshot.val();
            upcomingMatches.push(match);
          });
        });

      // get 11 player names for chat userdisplay name;
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
            playerNames.push(playerName);
          });
        });

      resolve({
        component: HomePage
      }, {
        context: {
          upcomingMatches: upcomingMatches,
          playerNames: playerNames
        }
      });
    }
  },
  {
    path: "/game-schedule/",
    async: async function (routeTo, routeFrom, resolve, reject) {
      const router = this;
      const app = router.app;
      app.preloader.show();
      const upcomingMatches = [];

      const formattedDate = getFormattedDate();

      await db
        .ref("/matches/")
        .orderByChild("match_date")
        .startAt(formattedDate)
        .once("value")
        .then(matchesSnapshot => {
          matchesSnapshot.forEach(matchSnapshot => {
            // push upcoming matches to array
            const match = matchSnapshot.val();
            upcomingMatches.push(match);
          });
        });

      app.preloader.hide();
      resolve({
        component: GameSchedulePage
      }, {
        context: {
          upcomingMatches: upcomingMatches
        }
      });
    }
  },
  {
    path: "/game-schedule/:teamId",
    async: async function (routeTo, routeFrom, resolve, reject) {
      const router = this;
      const app = router.app;
      const teamId = routeTo.params.teamId;
      const playedMatches = [];
      const upcomingMatches = [];

      app.preloader.show();
      await db
        .ref("/matches/")
        .orderByChild("match_date")
        .once("value")
        .then(matchesSnapshot => {
          matchesSnapshot.forEach(matchSnapshot => {
            const match = matchSnapshot.val();

            // loop through match properties
            matchSnapshot.forEach(teamSnapshot => {
              if (typeof teamSnapshot.val() === "object") {
                const team = teamSnapshot.val();
                if (team.key === teamId)
                  if (new Date(match.match_date) > Date.now()) {
                    upcomingMatches.push(match);
                  } else {
                    playedMatches.push(match);
                  }
              }
            });
          });
        });
      app.preloader.hide();
      resolve({
        component: GameSchedulePage
      }, {
        context: {
          playedMatches: playedMatches,
          upcomingMatches: upcomingMatches
        }
      });
    }
  },
  {
    path: "/teams/",
    component: TeamsPage
  },
  {
    path: "/:teamId/players/",
    component: TeamPlayersPage
  },
  {
    path: "/players/",
    component: TeamPlayersPage
  },
  {
    path: "/chat/",
    component: ChatPage
  },
  {
    path: "(.*)",
    component: NotFoundPage
  }
];

export default routes;