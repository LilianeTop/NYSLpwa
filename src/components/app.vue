<template>
  <f7-app :params="f7params">
    <!-- Left panel with cover effect-->
    <f7-panel left swipe cover class="bg-color-green">
      <f7-view>
        <f7-page>
          <f7-navbar title="Menu"></f7-navbar>
          <f7-list>
            <f7-list-item link="#" title="Home">
              <f7-icon slot="media" icon="demo-list-icon"></f7-icon>
            </f7-list-item>
            <f7-list-item link="#" title="Game Schedule">
              <f7-icon slot="media" icon="demo-list-icon"></f7-icon>
            </f7-list-item>
            <f7-list-item link="#" title="Teams">
              <f7-icon slot="media" icon="demo-list-icon"></f7-icon>
            </f7-list-item>
            <f7-list-item link="#" title="Players">
              <f7-icon slot="media" icon="demo-list-icon"></f7-icon>
            </f7-list-item>
            <f7-list-item v-if="isSignedIn" link="#" title="Chat">
              <f7-icon slot="media" icon="demo-list-icon"></f7-icon>
            </f7-list-item>
            <f7-list-item link="#" title="Contact">
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

    <!-- Popup -->
    <f7-popup id="my-popup">
      <f7-view>
        <f7-page>
          <f7-navbar title="Popup">
            <f7-nav-right>
              <f7-link popup-close>Close</f7-link>
            </f7-nav-right>
          </f7-navbar>
          <f7-block>
            <p>Popup content goes here.</p>
          </f7-block>
        </f7-page>
      </f7-view>
    </f7-popup>

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
            <f7-list-button title="Sign In" login-screen-close @click="login"></f7-list-button>
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
const firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyAibTbTOH_foNgXRdcT8SkJzGGMtx_lWcg",
  authDomain: "nysl-261007.firebaseapp.com",
  databaseURL: "https://nysl-261007.firebaseio.com",
  projectId: "nysl-261007",
  storageBucket: "nysl-261007.appspot.com",
  messagingSenderId: "304886205033",
  appId: "1:304886205033:web:5470ca0a7f9ced6887b0f8",
  measurementId: "G-E4BPBCGEPZ"
};

if (!firebase.apps.length) {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}
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
      isSignedIn: false,
    };
  },
  methods: {
    login() {
      // this.$f7.dialog.alert(
      //   "Username: " + this.username + "<br>Password: " + this.password
      // );
      auth
        .signInWithEmailAndPassword(this.username, this.password)
        .catch(error => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
        });
      console.log(this.username + " " + this.password);
    }
  },
  mounted() {
    this.$f7ready(f7 => {
      // Call F7 APIs here
      auth.onAuthStateChanged(user => {
        if (user) {
          // User is signed in.
          this.isSignedIn = true;
          console.log(user);
        } else {
          // User is signed out.
          // ...
        }
      });
    });
  }
};
</script>