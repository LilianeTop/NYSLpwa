// Import Vue
import Vue from "vue";

// Import Framework7
import Framework7 from "framework7/framework7-lite.esm.bundle.js";

// Import Framework7-Vue Plugin
import Framework7Vue from "framework7-vue/framework7-vue.esm.bundle.js";

// Import Framework7 Styles
import "framework7/css/framework7.bundle.css";

// Import Icons and App Custom Styles
import "../css/icons.css";
import "../css/app.css";

// Import App Component
import App from "../components/app.vue";

const firebase = require("./firebase");


// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);

//Mixin for team color
Vue.mixin({
  data: function(){
    return{
      isSignedIn: false,
      isConnected: false
    }
  },
  created: function() {
    // ?offline
    // warn: Loading failed for the <script> with source “https://nysl-261007.firebaseio.com/.lp?start=t&ser=18654638&cb=6&v=5”.
    // Set listener on connection
    const connectedRef = firebase.database().ref(".info/connected");
    connectedRef.on("value", snapshot => {
      if (snapshot.val() === true) {
        this.isConnected = true;
      } else {
        this.isConnected = false;
      }
    });
    // firebase.auth().onAuthStateChanged(user => {
    //     if (user) {
    //       // User is signed in.
    //       this.isSignedIn = true;
    //       this.$f7.loginScreen.close();
    //     } else {
    //       // User is signed out.
    //       this.isSignedIn = false;
    //     }
    //   });
  },
  methods: {
    teamColor: function (teamName) {
      switch (teamName) {
        case "U1":
          return "team-U1-bg";
        case "U2":
          return "team-U2-bg";
        case "U3":
          return "team-U3-bg";
        case "U4":
          return "team-U4-bg";
        case "U5":
          return "team-U5-bg";
        case "U6":
          return "team-U6-bg";
      }
    }
  }
});

// Init App
new Vue({
  el: "#app",
  render: h => h(App),

  // Register App Component
  components: {
    app: App
  }
});