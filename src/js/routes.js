import HomePage from "../pages/home.vue";
import GameSchedulePage from "../pages/game-schedule.vue";
import TeamsPage from "../pages/teams.vue";
import TeamPlayersPage from "../pages/team-players.vue";
import TeamStatisticsPage from "../pages/team-statistics.vue";
import ContactPage from "../pages/contact.vue";

import DynamicRoutePage from "../pages/dynamic-route.vue";
import RequestAndLoad from "../pages/request-and-load.vue";
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
        day = "" + date.getDate(),
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

      resolve(
        { component: HomePage },
        { context: { upcomingMatches: upcomingMatches } }
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
        day = "" + date.getDate(),
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
      app.preloader.show();
      const teamId = routeTo.params.teamId;
      const playedMatches = [];
      const upcomingMatches = [];

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
                  if (new Date(match.match_date) > Date.now())
                    upcomingMatches.push(match);
                  else playedMatches.push(match);
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
    path: "/:teamId/statistics/",
    component: TeamStatisticsPage
  },
  {
    path: "/players/",
    component: TeamPlayersPage
  },
  {
    path: "/contact/",
    component: ContactPage
  },

  {
    path: "/dynamic-route/blog/:blogId/post/:postId/",
    component: DynamicRoutePage
  },
  {
    path: "/request-and-load/user/:userId/",
    async: function(routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // User ID from request
      var userId = routeTo.params.userId;

      // Simulate Ajax Request
      setTimeout(function() {
        // We got user data from request
        var user = {
          firstName: "Vladimir",
          lastName: "Kharlampidi",
          about: "Hello, i am creator of Framework7! Hope you like it!",
          links: [
            {
              title: "Framework7 Website",
              url: "http://framework7.io"
            },
            {
              title: "Framework7 Forum",
              url: "http://forum.framework7.io"
            }
          ]
        };
        // Hide Preloader
        app.preloader.hide();

        // Resolve route to load page
        resolve(
          {
            component: RequestAndLoad
          },
          {
            context: {
              user: user
            }
          }
        );
      }, 1000);
    }
  },
  {
    path: "(.*)",
    component: NotFoundPage
  }
];

export default routes;
