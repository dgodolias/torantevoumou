const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.getUsers = functions.https.onRequest(async (req, res) => {
  try {
    const snapshot = await admin.database().ref("/users").once("value");
    const users = snapshot.val();
    res.json(users);
  } catch (error) {
    console.error("Error listing users:", error);
    res.status(500).send("Error listing users");
  }
});

exports.getUserInfo = functions.https.onRequest(async (req, res) => {
  try {
    const {userId} = req.query; // Changed from req.body to req.query
    const snapshot=await admin.database().ref(`/users/${userId}`).once("value");
    const user = snapshot.val();
    if (user) {
      res.json(user);
      console.log("User info:", user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error getting user info:", error);
    res.status(500).send("Error getting user info");
  }
});

exports.addUser = functions.https.onRequest(async (req, res) => {
  try {
    const {
      FirstName,
      LastName,
      Username,
      Password,
      Email,
      PhoneNumber,
      serviceswithappointmentkey,
    } = req.body;

    // Create user in Firebase Authentication
    const userCredential = await admin.auth().createUser({
      email: Email,
      password: Password,
      phoneNumber: PhoneNumber,
    });

    // Get the uid of the newly created user
    const uid = userCredential.uid;

    // Store additional user data in the Realtime Database
    await admin.database().ref(`/users/${uid}`).set({
      FirstName,
      LastName,
      Username,
      serviceswithappointmentkey,
    });

    res.status(200).send("User added successfully");
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send("Error adding user");
  }
});

exports.usernameExists = functions.https.onRequest(async (req, res) => {
  try {
    const {username} = req.query;
    console.log(`Checking if username exists: ${username}`);
    const usersRef = admin.database().ref("/users");
    const userQuery = usersRef.orderByChild("username").equalTo(username);
    const snapshot = await userQuery.once("value");
    const userExists = snapshot.val() !== null;
    res.json(userExists);
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).send("Error checking username");
  }
});

exports.emailExists = functions.https.onRequest(async (req, res) => {
  try {
    const {email} = req.query;
    console.log(`Checking if email exists: ${email}`);
    const userRecord = await admin.auth().getUserByEmail(email);
    const emailExists = userRecord !== null;
    res.json(emailExists);
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      res.json(false);
    } else {
      console.error("Error checking email:", error);
      res.status(500).send("Error checking email");
    }
  }
});

exports.phoneNumberExists = functions.https.onRequest(async (req, res) => {
  try {
    const {phoneNumber} = req.query;
    console.log(`Checking if phone number exists: ${phoneNumber}`);
    const userRecord = await admin.auth().getUserByPhoneNumber(phoneNumber);
    const phoneNumberExists = userRecord !== null;
    res.json(phoneNumberExists);
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      res.json(false);
    } else {
      console.error("Error checking phone number:", error);
      res.status(500).send("Error checking phone number");
    }
  }
});
