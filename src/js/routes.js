import HomePage from "../pages/home.vue";
import GameSchedulePage from "../pages/game-schedule.vue";
import TeamsPage from "../pages/teams.vue";
import TeamPlayersPage from "../pages/team-players.vue";
import ChatPage from "../pages/firechat.vue";
import ContactPage from "../pages/contact.vue";
import NotFoundPage from "../pages/404.vue";

const firebase = require("./firebase");
const db = firebase.database();
var routes = [
  {
    path: "/",
    async: async function(routeTo, routeFrom, resolve, reject) {
      const upcomingMatches = [];

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
            upcomingMatches.push(match);
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
            playerNames.push(playerName);
          });
        });

      resolve(
        { component: HomePage },
        {
          context: {
            upcomingMatches: upcomingMatches,
            playerNames: playerNames
          }
        }
      );
    }
  },
  {
    path: "/game-schedule/",
    async: async function(routeTo, routeFrom, resolve, reject) {
      const router = this;
      const app = router.app;
      app.preloader.show();
      const upcomingMatches = [];

      const date = new Date(Date.now());
      let month = "" + (date.getMonth() + 1),
        day = "" + (date.getDate() + 1),
        year = date.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;
      const formattedDate = [year, month, day].join("-");

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
      resolve(
        { component: GameSchedulePage },
        { context: { upcomingMatches: upcomingMatches } }
      );
    }
  },
  {
    path: "/game-schedule/:teamId",
    async: async function(routeTo, routeFrom, resolve, reject) {
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
            matchSnapshot.forEach(childSnapshot => {
              if (typeof childSnapshot.val() === "object") {
                const team = childSnapshot.val();
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
      resolve(
        { component: GameSchedulePage },
        {
          context: {
            playedMatches: playedMatches,
            upcomingMatches: upcomingMatches
          }
        }
      );
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
    path: "/contact/",
    component: ContactPage
  },
  {
    path: "(.*)",
    component: NotFoundPage
  }
];

export default routes;
