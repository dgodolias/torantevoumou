require('dotenv').config();
var admin = require("firebase-admin");

var privateKey;

try {
  privateKey = require("./key.json");
} catch (error) {
  privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
}

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    projectId: "torantevoumou",
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
    privateKey: privateKey,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_CLIENT_ID,
    authUri: process.env.FIREBASE_AUTH_URI,
    tokenUri: process.env.FIREBASE_TOKEN_URI,
    authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL
  }),
  databaseURL: "https://torantevoumou-default-rtdb.europe-west1.firebasedatabase.app"
});

console.log("Firebase admin app has been initialized.");

// Add any other Firebase-related code here.