<template>
  <f7-page id="main" name="home">
    <!-- Top Navbar -->
    <f7-navbar :sliding="false" large>
      <f7-nav-left>
        <f7-link icon-ios="f7:menu" icon-aurora="f7:menu" icon-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title sliding>NYSL</f7-nav-title>

      <f7-nav-title-large sliding>NYSL</f7-nav-title-large>
      <f7-nav-right>
        <f7-link 
          icon-ios="f7:contact"
          icon-aurora="f7:person"
          icon-md="material:person"
          fill
          raised
          login-screen-open="#login-screen"
        >Log-In</f7-link>
      </f7-nav-right>
    </f7-navbar>

    <!-- Page content-->
    <f7-block strong>
      <p>TODO upcoming events show 3 or so</p>

      <p>Each tab/view may have different layout, different navbar type (dynamic, fixed or static) or without navbar like this tab.</p>
    </f7-block>
  </f7-page>
</template>
<script>
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
const firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/database");
export default {
  data() {
    return {
      players: []
    };
  },
  created() {
    // Your web app's Firebase configuration

    const db = firebase.database();
    db.ref("/players/")
      .once("value")
      .then(snapshot => {
        snapshot.forEach(snapshot => {
          const player = snapshot.val();
          player.key = snapshot.key;
          this.players.push(player);
        });
      });
  }
};
</script>