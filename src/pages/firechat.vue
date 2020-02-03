<template>
 
    <f7-page bg-color='teal'>
      <f7-navbar title="Chat" back-link="Back"></f7-navbar>
      <f7-page-content>
        <!-- Fire chat -->
        <f7-block strong inset>
          <f7-block-title>Logged in as: {{ username }}</f7-block-title>
          <div id="firechat-wrapper"></div>
        </f7-block>
      </f7-page-content>
    </f7-page>
</template>

<script>
const firebase = require("../js/firebase");

export default {
  data() {
    return {
      username: ""
    };
  },
  mounted: async function() {
    const db = firebase.database();
    const auth = firebase.auth();
    const user = auth.currentUser;
    if (user) {
      const chatRef = firebase.database().ref("chat");
      // instantiate firechat ui if user is logged in
      const chat = new FirechatUI(
        chatRef,
        document.getElementById("firechat-wrapper")
      );
      this.username = user.displayName;
      chat.setUser(user.uid, user.displayName);
    }
  }
};
</script>
<style scoped>
.firechat-container {
  background-color: rgb(134, 134, 29);
}
</style>