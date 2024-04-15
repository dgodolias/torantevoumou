var admin = require("firebase-admin");

var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://torantevoumou-default-rtdb.europe-west1.firebasedatabase.app"
});

console.log("Firebase admin app has been initialized.");

// Add any other Firebase-related code here