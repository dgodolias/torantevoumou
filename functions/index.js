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

exports.GetUserDBinfo = functions.https.onRequest(async (req, res) => {
  try {
    const {userId} = req.query; // Changed from req.body to req.query
    const snapshotDB = await admin.database();
    const snapshot = snapshotDB.ref(`/users/${userId}`).once("value");
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

  // Respond to OPTIONS requests (required by CORS preflight)
  if (req.method === "OPTIONS") {
    res.status(200).send();
    return;
  }

  console.log("updateUser function called");

  try {
    const {UserId, ...updates} = req.body;

    console.log(`Received data: UserId=${UserId}`);
    console.log(`Updates: ${JSON.stringify(updates)}`);

    if (!UserId || Object.keys(updates).length !== 1) {
      console.log("Invalid request");
      res.status(400).send("Invalid request");
      return;
    }

    // Check if user exists in Firebase Authentication
    const userRecord = await admin.auth().getUser(UserId);
    if (userRecord) {
      console.log(`User ${UserId} exists in Firebase Authentication`);
    } else {
      console.log(`User ${UserId} does not exist in Firebase Authentication`);
    }
    if (!userRecord) {
      res.status(404).send("User not found");
      return;
    }

    if (Object.prototype.hasOwnProperty.call(updates, "email")) {
      await admin.auth().updateUser(UserId, {email: updates.email});
      console.log(`Updated email for user ${UserId} to ${updates.email}`);
    }

    // Create a copy of the updates object and remove the 'email' property
    const updatesForDatabase = {...updates};
    delete updatesForDatabase.email;

    console.log(`Updating user ${UserId} with data:`, updatesForDatabase);

    await admin.database().ref(`/users/${UserId}`).update(updatesForDatabase);

    console.log("User updated successfully");
    res.status(200).json({message: "User updated successfully"});
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Error updating user");
  }
});

exports.addAppointment = functions.https.onRequest(async (req, res) => {
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

  // Ensure the request method is POST
  if (req.method !== "POST") {
    console.log("Attempt to use non-POST method");
    res.status(405).send("Method Not Allowed");
    return;
  }

  const {UserId, serviceName, appointmentDate, appointmentTime} = req.body;

  // Validate input
  if (!UserId || !serviceName || !appointmentDate || !appointmentTime) {
    console.log("Missing required fields in the request");
    res.status(400).send("Missing required fields");
    return;
  }

  // Reference to the services and users in the database
  const servicesRef = admin.database().ref("services");
  const usersRef = admin.database().ref("users");

  try {
    console.log(`Adding appointment for user ${UserId} with service ` +
      `${serviceName} on ${appointmentDate} at ${appointmentTime}`);
    // Add the appointment to the services table
    const newAppointmentRef = servicesRef.child(serviceName).push();
    await newAppointmentRef.set({
      UID: UserId,
      appointmentDate,
      appointmentTime,
    });

    // Get the generated key for the appointment
    const appointmentKey = newAppointmentRef.key;

    console.log(`Updating user ${UserId} with new appointment key ` +
      `${appointmentKey}`);
    // Update the user's services with appointment key
    const userRef = usersRef.child(UserId);
    const userSnapshot = await userRef.once("value");
    const userData = userSnapshot.val();

    let servicesWithAppointmentKey = userData.serviceswithappointmentkey || "";
    if (servicesWithAppointmentKey.includes(serviceName)) {
      // Append the new appointment key
      const regex = new RegExp(`${serviceName}\\((.*?)\\)#`, "g");
      servicesWithAppointmentKey = servicesWithAppointmentKey.replace(regex,
          (match, p1) => {
            return `${serviceName}(${p1},${appointmentKey})#`;
          });
    } else {
      // Add the new service with the appointment key
      servicesWithAppointmentKey += `${serviceName}(${appointmentKey})#`;
    }

    // Update the user's record
    await userRef.update({
      serviceswithappointmentkey: servicesWithAppointmentKey,
    });

    res.status(200).json({message: "Appointment added successfully"});
  } catch (error) {
    console.error("Error adding appointment:", error);
    res.status(500).json({message: "Internal Server Error"});
  }
});

exports.getServices = functions.https.onRequest(async (req, res) => {
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

  console.log("Fetching services...");

  try {
    const servicesDB = await admin.database();
    const servicesSnapshot = await servicesDB.ref("/services").once("value");
    if (!servicesSnapshot.exists()) {
      console.log("No services found.");
      res.status(404).json({error: "No services found"});
      return;
    }

    const services = servicesSnapshot.val();
    const serviceNames = Object.keys(services).map((key) => services[key]);

    console.log("Services fetched successfully:", serviceNames);

    res.json(serviceNames); // Directly return the array
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({error: "Internal server error"});
  }
});
