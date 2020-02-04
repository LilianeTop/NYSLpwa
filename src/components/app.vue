<template>
  <f7-app :params="f7params">
    <!-- Left panel with cover effect-->
    <f7-panel left swipe :swipeActiveArea="100" cover class="bg-color-green">
      <f7-view @team-color="teamColor">
        <f7-page>
          <!-- navigation -->
          <f7-navbar title="Menu"></f7-navbar>
          <f7-list class="m-0">
            <f7-list-item link="/home/" view="#main" panel-close title="Home">
              <f7-icon slot="media" material="home"></f7-icon>
            </f7-list-item>
            <f7-list-item link="/game-schedule/" view="#main" panel-close title="Game Schedule">
              <f7-icon slot="media" material="schedule"></f7-icon>
            </f7-list-item>
            <f7-list-item link="/teams/" view="#main" panel-close title="Teams">
              <f7-icon slot="media" material="group"></f7-icon>
            </f7-list-item>
            <f7-list-item link="/players/" view="#main" panel-close title="Players">
              <f7-icon slot="media" material="person"></f7-icon>
            </f7-list-item>
            <f7-list-item v-if="isSignedIn" link="/chat/" view="#main" panel-close title="Chat">
              <f7-icon slot="media" material="chat"></f7-icon>
            </f7-list-item>
          </f7-list>
        </f7-page>
      </f7-view>
    </f7-panel>

    <!-- Your main view, should have "view-main" class -->
    <f7-view main class="safe-areas" url="/"></f7-view>
    <!-- log in screen -->
    <f7-login-screen id="login-screen">
      <f7-view>
        <f7-page login-screen>
          <f7-toolbar><div class="left"></div>
            <div class="right">
              <!-- close login -->
              <f7-link login-screen-close>X</f7-link>
            </div>
          </f7-toolbar>
          <f7-login-screen-title>Log-in</f7-login-screen-title>
          <f7-list form>
            <f7-list-input
              type="text"
              name="username"
              placeholder="Your username"
              :value="username"
              @input="username = $event.target.value"
            ></f7-list-input>
            <f7-list-input
              type="password"
              name="password"
              placeholder="Your password"
              :value="password"
              @input="password = $event.target.value"
            ></f7-list-input>
          </f7-list>
          <f7-list>
            <f7-list-button title="Sign In" @click="login"></f7-list-button>
          </f7-list>
        </f7-page>
      </f7-view>
    </f7-login-screen>
  </f7-app>
</template>
<script>
import routes from "../js/routes.js";
const firebase = require("../js/firebase");
const auth = firebase.auth();

export default {
  data() {
    return {
      // Framework7 Parameters
      f7params: {
        name: "NYSL", // App name
        theme: "auto", // Automatic theme detection

        // App routes
        routes: routes,
        // Register service worker
        serviceWorker: {
          path: "/service-worker.js"
        }
      },

      // Login screen data
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      console.log(this.isSignedIn)
      if (!this.isSignedIn) {
        auth
          .signInWithEmailAndPassword(this.username, this.password)
          .catch(error => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            this.$f7.dialog.alert(errorMessage, () => {});
          });
      }
    }
  },
  mounted() {
    this.$f7ready(f7 => {
      // Call F7 APIs here
    });
  }
};
</script>
<style>
.team-U1-bg {
  background-color: rgb(230, 69, 69);
}
.team-U2-bg {
  background-color: rgb(19, 199, 199);
}
.team-U3-bg {
  background-color: rgb(195, 107, 206);
}
.team-U4-bg {
  background-color: rgb(147, 199, 16);
}
.team-U5-bg {
  background-color: rgb(175, 88, 88);
}
.team-U6-bg {
  background-color: rgb(140, 133, 208);
}
.header {
  font-size: 24px;
  padding-bottom: 5px;
  text-align: center;
  color: white;
}
.matches {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  background-color: #9cd6ad;
}

</style>
<style scoped>
.m-0 {
  margin: 0;
}
</style>