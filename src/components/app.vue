<template>
  <f7-app :params="f7params">
    <!-- Left panel with cover effect-->
    <f7-panel left swipe swipeActiveArea="100" cover class="bg-color-green">
      <f7-view>
        <f7-page>
          <f7-navbar title="Menu"></f7-navbar>
          <f7-list>
            <f7-list-item link="#" title="Home">
              <f7-icon slot="media" icon="demo-list-icon"></f7-icon>
            </f7-list-item>
            <f7-list-item
              link="/game-schedule/"
              view="#main"
              panel-close
              title="Game Schedule"
            >
              <f7-icon slot="media" icon="demo-list-icon"></f7-icon>
            </f7-list-item>
            <f7-list-item link="/teams/" view="#main" panel-close title="Teams">
              <f7-icon slot="media" icon="demo-list-icon"></f7-icon>
            </f7-list-item>
            <f7-list-item
              link="/players/"
              view="#main"
              panel-close
              title="Players"
            >
              <f7-icon slot="media" icon="demo-list-icon"></f7-icon>
            </f7-list-item>
            <f7-list-item v-if="isSignedIn" link="#" title="Chat">
              <f7-icon slot="media" icon="demo-list-icon"></f7-icon>
            </f7-list-item>
            <f7-list-item
              link="/contact/"
              view="#main"
              panel-close
              title="Contact"
            >
              <f7-icon slot="media" icon="demo-list-icon"></f7-icon>
            </f7-list-item>
          </f7-list>
        </f7-page>
      </f7-view>
    </f7-panel>

    <!-- Right panel with reveal effect-->
    <f7-panel right reveal theme-dark>
      <f7-view>
        <f7-page>
          <f7-navbar title="Right Panel"></f7-navbar>
          <f7-block>Right panel content goes here</f7-block>
        </f7-page>
      </f7-view>
    </f7-panel>

    <!-- Your main view, should have "view-main" class -->
    <f7-view main class="safe-areas" url="/"></f7-view>

    <f7-login-screen id="login-screen">
      <f7-view>
        <f7-page login-screen>
          <f7-login-screen-title>Login</f7-login-screen-title>
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
            <f7-list-button
              title="Sign In"
              login-screen-close
              @click="login"
            ></f7-list-button>
            <f7-block-footer>
              Some text about login information.
              <br />Click "Sign In" to close Login Screen
            </f7-block-footer>
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
        isSignedIn: false,

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
      isSignedIn: false
    };
  },
  methods: {
    login() {
      if (!this.isSignedIn) {
        auth
          .signInWithEmailAndPassword(this.username, this.password)
          .catch(error => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
          });
      }
      // console.log(this.username + " " + this.password);
    },
    logout() {
      if (this.isSignedIn) auth.signOut();
    }
  },
  mounted() {
    this.$f7ready(f7 => {
      // Call F7 APIs here
      auth.onAuthStateChanged(user => {
        if (user) {
          // User is signed in.
          this.isSignedIn = true;
          f7.isSignedIn = true;
          console.log(user);
        } else {
          // User is signed out.
          // ...
          this.isSignedIn = false;
          f7.isSignedIn = false;
        }
      });
    });
  }
};
</script>
