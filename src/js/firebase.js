const firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/database");

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

module.exports = firebase;
