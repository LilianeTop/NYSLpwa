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

const db = firebase.database();

function generateMatches(firstName, lastName, goals, yellow_cards, red_cards) {
    const matches = {
        matches: {
            match1: {
                match_time: 90,
                match_date: "23-01-2020",
                team1: {
                    players: {
                        player1: {
                            first_name: firstName,
                            last_name: lastName,
                            goals: goals,
                            yellow_cards: yellow_cards,
                            red_cards: red_cards
                        },
                        player2: {
                            first_name: firstName,
                            last_name: lastName,
                            goals: 1,
                            yellow_cards: yellow_cards,
                            red_cards: red_cards
                        }
                    }
                },
                team2: true
            }
        }
    };
}

function generateTeams(teamName) {
    const teams = {
        teams: {
            team1: {
                name: teamName,
                player1: true,
                player2: true
            },
            team2: {
                name: teamName
            }
        }
    };
}

// function generateTeamMembers() {
//     const teamMembers = {
//         teamMembers: {
//             team1: {
//                 player1: true,
//                 player2: true
//             }
//         }
//     };
// }
/*function generatePlayers(firstName, lastName) {
	const players = {
		players: {
			player1: {
				first_name: firstName,
				last_name: lastName
			},
			player2: {
				first_name: firstName,
				last_name: lastName
			}
		}
	};
}*/

function pushPlayers() {
    const firstNames = ["Adam", "Alex", "Aaron", "Ben", "Carl", "Dan", "David", "Edward", "Fred", "Frank", "George", "Hal", "Hank", "Ike", "John", "Jack", "Joe", "Larry", "Monte", "Matthew", "Mark", "Nathan", "Otto", "Paul", "Peter", "Roger", "Roger", "Steve", "Thomas", "Tim", "Ty", "Victor", "Walter"];
    const lastNames = ["Anderson", "Ashwoon", "Aikin", "Bateman", "Bongard", "Bowers", "Boyd", "Cannon", "Cast", "Deitz", "Dewalt", "Ebner", "Frick", "Hancock", "Haworth", "Hesch", "Hoffman", "Kassing", "Knutson", "Lawless", "Lawicki", "Mccord", "McCormack", "Miller", "Myers", "Nugent", "Ortiz", "Orwig", "Ory", "Paiser", "Pak", "Pettigrew", "Quinn", "Quizoz", "Ramachandran", "Resnick", "Sagar", "Schickowski", "Schiebel", "Sellon", "Severson", "Shaffer", "Solberg", "Soloman", "Sonderling", "Soukup", "Soulis", "Stahl", "Sweeney", "Tandy", "Trebil", "Trusela", "Trussel", "Turco", "Uddin", "Uflan", "Ulrich", "Upson", "Vader", "Vail", "Valente", "Van Zandt", "Vanderpoel", "Ventotla", "Vogal", "Wagle", "Wagner", "Wakefield", "Weinstein", "Weiss", "Woo", "Yang", "Yates", "Yocum", "Zeaser", "Zeller", "Ziegler", "Bauer", "Baxster", "Casal", "Cataldi"]

    const ref = "players";

    if (db.ref(`/${ref}/`)) {
        db.ref(`/${ref}/`).remove;
        db.ref(`/${ref}/`).set({})
    }

    for (let i = 0; i < 66; i++) {
        pushData(
            generatePlayer(firstNames[Math.floor(Math.random() * firstNames.length)], lastNames[Math.floor(Math.random() * lastNames.length)], (i % 11) + 1, randomBirthdate(new Date(2006, 0, 1), new Date(2011, 12, 31)))
            , "players");
    }
    // pushData(generatePlayer('liliane', 'top'), 'players');
}

function generatePlayer(firstName, lastName, shirtNumber, birthDate) {
    let position = ''
    if (shirtNumber === 1) {
        position = 'goalkeeper';
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

function randomBirthdate(start, end) {
    let d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}




function generateUsers() {
    const users = {
        users: {
            user1: {
                player1: true
            }
        }
    };
}

function pushData(data, ref) {
    const key = db.ref().child(ref).push().key;
    let updates = {};
    updates[`/${ref}/` + key] = data
    db.ref().update(updates)
}



pushPlayers();