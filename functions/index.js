const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require('nodemailer');

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

exports.GetUserDBinfo = functions.https.onRequest(async (req, res) => {
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

exports.GetUserAUTHinfo = functions.https.onRequest(async (req, res) => {
  try {
    const {userId} = req.query;
    const userRecord = await admin.auth().getUser(userId);

    if (userRecord) {
      const {email, phoneNumber} = userRecord;
      let formattedPhoneNumber = "";
      if (phoneNumber) {
        formattedPhoneNumber = phoneNumber.replace("+30", "");
      }

      res.json({
        email,
        phoneNumber: formattedPhoneNumber,
      });

      const userInfo = {email, phoneNumber: formattedPhoneNumber};
      console.log("User auth info:", userInfo);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error getting user auth info:", error);
    res.status(500).send("Error getting user auth info");
  }
});

exports.addUser = functions.https.onRequest(async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const {
      FirstName,
      LastName,
      Username,
      Password,
      Email,
      PhoneNumber,
      serviceswithappointmentkey,
    } = req.body;

    console.log("Creating user in Firebase Authentication...");

    const userCredential = await admin.auth().createUser({
      email: Email,
      password: Password,
      phoneNumber: PhoneNumber,
    });

    console.log("User created in Firebase Authentication");

    const uid = userCredential.uid;

    console.log("Storing user data in Realtime Database...");

    await admin.database().ref(`/users/${uid}`).set({
      FirstName,
      LastName,
      Username,
      serviceswithappointmentkey,
    });

    console.log("User data stored in Realtime Database");

    res.status(200).send("User added successfully");
    console.log("User added successfully");
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

exports.getUserAppointments = functions.https.onRequest(async (req, res) => {
  try {
    const serviceAppointments = req.body;
    const appointments = [];

    for (const service in serviceAppointments) {
      if (Object.prototype.hasOwnProperty.call(serviceAppointments, service)) {
        for (const appointmentId of serviceAppointments[service]) {
          const db = await admin.database();
          const path = `/services/${service}/${appointmentId}`;
          const snapshot = await db.ref(path).once("value");
          const appointment = snapshot.val();
          if (appointment) {
            appointments.push(appointment);
          }
        }
      }
    }

    res.json(appointments);
  } catch (error) {
    console.error("Error getting appointments:", error);
    res.status(500).send("Error getting appointments");
  }
});

exports.updateUser = functions.https.onRequest(async (req, res) => {
  const allowedOrigins = [
    "https://localhost:7177",
    "https://www.torantevoumou.gr",
    "https://torantevoumou.gr",
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }

  res.set("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.status(200).send();
    return;
  }

  try {
    const {UserId, ...updates} = req.body;

    if (!UserId || Object.keys(updates).length !== 1) {
      res.status(400).send("Invalid request");
      return;
    }

    const userRecord = await admin.auth().getUser(UserId);
    if (!userRecord) {
      res.status(404).send("User not found");
      return;
    }

    const updatesForDatabase = {...updates};
    delete updatesForDatabase.email;

    await admin.database().ref(`/users/${UserId}`).update(updatesForDatabase);

    res.status(200).json({message: "User updated successfully"});
  } catch (error) {
    res.status(500).send("Error updating user");
  }
});

exports.requestEmailChange = functions.https.onRequest(async (req, res) => {
  const allowedOrigins = [
    "https://localhost:7177",
    "https://www.torantevoumou.gr",
    "https://torantevoumou.gr",
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }

  res.set("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.status(200).send();
    return;
  }

  try {
    const {UserId, email} = req.body;

    const token = crypto.randomBytes(20).toString('hex');

    await admin.database().ref(`/users/${UserId}`).update({
      emailChangeToken: token,
      newEmail: email
    });

    await sendVerificationEmail(email, token);

    res.status(200).json({message: "Email change requested successfully"});
  } catch (error) {
    res.status(500).send("Error requesting email change");
  }
});

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require('nodemailer');

admin.initializeApp();

exports.requestEmailChange = functions.https.onRequest(async (req, res) => {
  const allowedOrigins = [
    "https://localhost:7177",
    "https://www.torantevoumou.gr",
    "https://torantevoumou.gr",
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }

  res.set("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.status(200).send();
    return;
  }

  try {
    const { UserId, email } = req.body;

    const token = crypto.randomBytes(20).toString('hex');

    await admin.database().ref(`/users/${UserId}`).update({
      emailChangeToken: token,
      newEmail: email
    });

    await sendVerificationEmail(email, token);

    res.status(200).json({ message: "Email change requested successfully" });
  } catch (error) {
    res.status(500).send("Error requesting email change");
  }
});

async function sendVerificationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your_email@gmail.com',
      pass: 'your_password'
    }
  });

  const mailOptions = {
    from: 'Torantevoumou <your_email@gmail.com>',
    to: email,
    subject: 'Email Change Verification',
    html: `
      <p>Hello,</p>
      <p>You have requested to change your email address for your Torantevoumou account.</p>
      <p>To confirm this change, please click on the following link:</p>
      <p><a href="https://torantevoumou.gr/verify-email?token=${token}">Verify Email</a></p>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not request this change, please ignore this email.</p>
      <p>Sincerely,</p>
      <p>The Torantevoumou Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}



