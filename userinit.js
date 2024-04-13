var admin = require("firebase-admin");
var fs = require('fs');

var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://torantevoumou-default-rtdb.europe-west1.firebasedatabase.app"
});

console.log("Firebase admin app has been initialized.");

var db = admin.database();
var ref = db.ref("users"); // create a reference to the "users" node

fs.readFile('Users.json', 'utf8', function (err, data) {
  if (err) {
    console.log("Error reading file: ", err);
    return;
  }

  var users = JSON.parse(data);

  ref.set(users, function(error) {
    if (error) {
      console.log("Data could not be saved." + error);
    } else {
      console.log("Data saved successfully.");
      admin.app().delete().then(function() {
        console.log("App deleted successfully");
      }).catch(function(error) {
        console.log("Error deleting app:", error);
      });
    }
  });
});