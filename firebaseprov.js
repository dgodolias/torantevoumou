var admin = require("firebase-admin");

var privateKey;

try {
  privateKey = require("./key.json");
} catch (error) {
  privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
}

process.env.FIREBASE_PRIVATE_KEY_ID = "b107c7102aedd63ec4effbf5e178ca2b2674fced";
process.env.FIREBASE_CLIENT_EMAIL = "firebase-adminsdk-xzywf@torantevoumou.iam.gserviceaccount.com";
process.env.FIREBASE_CLIENT_ID = "118208077520675921916";
process.env.FIREBASE_AUTH_URI = "https://accounts.google.com/o/oauth2/auth";
process.env.FIREBASE_TOKEN_URI = "https://oauth2.googleapis.com/token";
process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL = "https://www.googleapis.com/oauth2/v1/certs";
process.env.FIREBASE_CLIENT_X509_CERT_URL = "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xzywf%40torantevoumou.iam.gserviceaccount.com";

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