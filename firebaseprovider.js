var admin = require("firebase-admin");

var privateKey = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    projectId: "torantevoumou",
    privateKeyId: "39e9eb25a56f32af7afdcfa0a02e3d324a37fe53",
    privateKey: privateKey,
    clientEmail: "firebase-adminsdk-xzywf@torantevoumou.iam.gserviceaccount.com",
    clientId: "118208077520675921916",
    authUri: "https://accounts.google.com/o/oauth2/auth",
    tokenUri: "https://oauth2.googleapis.com/token",
    authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
    clientX509CertUrl: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xzywf%40torantevoumou.iam.gserviceaccount.com"
  }),
  databaseURL: "https://torantevoumou-default-rtdb.europe-west1.firebasedatabase.app"
});

console.log("Firebase admin app has been initialized.");

// Add any other Firebase-related code here