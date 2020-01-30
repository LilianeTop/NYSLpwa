const firebase = require("firebase");
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
// create db
const db = firebase.database();
const players = [];
const teams = [];

// check if table exist if so remove and create new empty one
function removeIfExists(ref) {
  if (db.ref(`/${ref}/`)) {
    db.ref(`/${ref}/`).remove;
    db.ref(`/${ref}/`).set({});
  }
}
// generate a match between 2 random teams on a random date which has to be a saturday
// matchTime also randomly created
function generateMatch() {
  // const team1 = teams[Math.floor(Math.random() * teams.length)];
  const team1 = teams[Math.floor(Math.random() * teams.length)];
  const teamCopy1 = Object.assign({}, team1);
  let team2;
  //while team2 equals team1 select another team
  do {
    team2 = teams[Math.floor(Math.random() * teams.length)];
  } while (team1 === team2);
  const teamCopy2 = Object.assign({}, team2);

  // random date between 2019 and 2020
  const matchDate = randomDate(
    new Date(2019, 0, 0),
    new Date(2021, 0, 0),
    false
  );

  if (new Date(matchDate) < Date.now()) {
    // iterate over the players in team1 and assign the goals and cards
    for (let playerKey in team1) {
      if (team1[playerKey] === true) {
        teamCopy1[playerKey] = {};
        teamCopy1[playerKey].goals = calcGoals();
        teamCopy1[playerKey].yellow_cards = yellowCards();
        teamCopy1[playerKey].red_card = redCard(
          teamCopy1[playerKey].yellow_cards
        ); // two yellow cards equals 1 red card
      }
    }

    // iterate over the players in team2 and assign the goals and cards
    for (let playerKey in team2) {
      if (team2[playerKey] === true) {
        teamCopy2[playerKey] = {};
        teamCopy2[playerKey].goals = calcGoals();
        teamCopy2[playerKey].yellow_cards = yellowCards();
        teamCopy2[playerKey].red_card = redCard(
          teamCopy2[playerKey].yellow_cards
        ); // two yellow cards equals 1 red card
      }
    }
  }
  // create Match object
  const match = {
    match_time: matchTime(),
    match_date: matchDate
  };

  // attaching 2 teams to a match
  match[team1.key] = teamCopy1;
  match[team2.key] = teamCopy2;

  return match;
}

//calculate goals with 20% chance per player
const calcGoals = () => {
  const pct = Math.random();
  if (pct < 0.2) {
    return Math.floor(Math.random() * 3) + 1;
  } else return 0;
};

//calculate yellow cards with max of 2 per player
const yellowCards = () => {
  const pct = Math.random();
  if (pct < 0.1) {
    return Math.round(Math.random() * 2);
  } else return 0;
};

//calculate red cards either 2 yellow cards equals 1 red or it is randomly assigned
const redCard = yellowCards => {
  if (yellowCards === 2) return 1;
  else {
    const pct = Math.random();
    if (pct < 0.01) {
      return 1;
    } else return 0;
  }
};

// calculate match time 10% chance for overtime
const matchTime = () => {
  const pct = Math.random();
  if (pct < 0.1) {
    return Math.floor(Math.random() * (110 - 90) + 90);
  } else return 90;
};

// pushing matches to Firebase
async function pushMatches() {
  const ref = "matches";
  removeIfExists(ref);

  for (let i = 0; i < 100; i++) {
    await pushData(generateMatch(), ref);
  }
}
// create team object with playerkeys
function generateTeam(teamName, arrPlayerKeys) {
  const team = {
    name: teamName
  };
  arrPlayerKeys.forEach(playerKey => (team[playerKey] = true));
  return team;
}
// pushing teams to Firebase
function pushTeams() {
  const ref = "teams";
  removeIfExists(ref);

  const arrPlayerKeys = [];
  const teamNames = ["U1", "U2", "U3", "U4", "U5", "U6"];
  let teamNameIndex = 0;
  // loop through player and assign to team
  players.forEach((player, index) => {
    arrPlayerKeys.push(player.key);
    if ((index + 1) % 11 === 0) {
      pushData(generateTeam(teamNames[teamNameIndex], arrPlayerKeys), ref);
      teamNameIndex++;
      arrPlayerKeys.splice(0);
    }
  });
}

// create player object
function generatePlayer(firstName, lastName, shirtNumber, birthDate) {
  let position = "";
  if (shirtNumber === 1) {
    position = "goalkeeper";
  } else if (shirtNumber < 6) {
    position = "defender";
  } else if (shirtNumber < 10) {
    position = "midfielder";
  } else if (shirtNumber < 12) {
    position = "forward";
  }

  return {
    first_name: firstName,
    last_name: lastName,
    shirt_number: shirtNumber,
    position: position,
    date_of_birth: birthDate
  };
}

// pushing players to Firebase
function pushPlayers() {
  const firstNames = [
    "Adam",
    "Alex",
    "Aaron",
    "Ben",
    "Carl",
    "Dan",
    "David",
    "Edward",
    "Fred",
    "Frank",
    "George",
    "Hal",
    "Hank",
    "Ike",
    "John",
    "Jack",
    "Joe",
    "Larry",
    "Monte",
    "Matthew",
    "Mark",
    "Nathan",
    "Otto",
    "Paul",
    "Peter",
    "Roger",
    "Roger",
    "Steve",
    "Thomas",
    "Tim",
    "Ty",
    "Victor",
    "Walter"
  ];
  const lastNames = [
    "Anderson",
    "Ashwoon",
    "Aikin",
    "Bateman",
    "Bongard",
    "Bowers",
    "Boyd",
    "Cannon",
    "Cast",
    "Deitz",
    "Dewalt",
    "Ebner",
    "Frick",
    "Hancock",
    "Haworth",
    "Hesch",
    "Hoffman",
    "Kassing",
    "Knutson",
    "Lawless",
    "Lawicki",
    "Mccord",
    "McCormack",
    "Miller",
    "Myers",
    "Nugent",
    "Ortiz",
    "Orwig",
    "Ory",
    "Paiser",
    "Pak",
    "Pettigrew",
    "Quinn",
    "Quizoz",
    "Ramachandran",
    "Resnick",
    "Sagar",
    "Schickowski",
    "Schiebel",
    "Sellon",
    "Severson",
    "Shaffer",
    "Solberg",
    "Soloman",
    "Sonderling",
    "Soukup",
    "Soulis",
    "Stahl",
    "Sweeney",
    "Tandy",
    "Trebil",
    "Trusela",
    "Trussel",
    "Turco",
    "Uddin",
    "Uflan",
    "Ulrich",
    "Upson",
    "Vader",
    "Vail",
    "Valente",
    "Van Zandt",
    "Vanderpoel",
    "Ventotla",
    "Vogal",
    "Wagle",
    "Wagner",
    "Wakefield",
    "Weinstein",
    "Weiss",
    "Woo",
    "Yang",
    "Yates",
    "Yocum",
    "Zeaser",
    "Zeller",
    "Ziegler",
    "Bauer",
    "Baxster",
    "Casal",
    "Cataldi"
  ];

  const ref = "players";
  removeIfExists(ref);

  // creating 66 players based on random names
  for (let i = 0; i < 66; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const shirtNumber = (i % 11) + 1;
    const startDate = new Date(2006, 0, 1);
    const endDate = new Date(2011, 12, 31);

    pushData(
      generatePlayer(
        firstName,
        lastName,
        shirtNumber,
        randomDate(startDate, endDate, true)
      ),
      ref
    );
  }
}
// creating a random birthdate or a random matchDate between startDate & endDate
function randomDate(startDate, endDate, isBirthdate) {
  let date = new Date(
      startDate.getTime() +
        Math.random() * (endDate.getTime() - startDate.getTime())
    ),
    month = "" + (date.getMonth() + 1),
    day = "" + date.getDate(),
    year = date.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  if (isBirthdate) return [year, month, day].join("-");
  else {
    // matches are only on saturdays
    while (date.getDay() != 6) {
      date = new Date(
        startDate.getTime() +
          Math.random() * (endDate.getTime() - startDate.getTime())
      );
    }
    return [year, month, day].join("-");
  }
}

// pushing data to Firebase
function pushData(data, ref) {
  const key = db
    .ref()
    .child(ref)
    .push().key; // generates key/id
  let updates = {};
  updates[`/${ref}/` + key] = data;

  data.key = key;
  switch (ref) {
    case "players":
      players.push(data);
      break;
    case "teams":
      teams.push(data);
      break;
    case "matches":
      // console.log(data);
      break;
  }

  return db.ref().update(updates);
}

// invoking all functions
pushPlayers();
pushTeams();
pushMatches();
