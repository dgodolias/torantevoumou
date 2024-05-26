require('dotenv').config();
var admin = require("firebase-admin");

var serviceAccount;

try {
  serviceAccount = require("./key.json");
} catch (error) {
  serviceAccount = {
    type: "service_account",
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_CLIENT_ID,
    authUri: process.env.FIREBASE_AUTH_URI,
    tokenUri: process.env.FIREBASE_TOKEN_URI,
    authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL
  };
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://torantevoumou-default-rtdb.europe-west1.firebasedatabase.app"
});

console.log("Firebase admin app has been initialized.");

// Add any other Firebase-related code here.