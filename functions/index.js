const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {getAuth} = require("firebase-admin/auth"); // Import getAuth

admin.initializeApp();

exports.sendVerificationEmail = functions.https.onRequest(async (req, res) => {
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

  const email = req.body.email;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  const actionCodeSettings = {
    url: "https://www.torantevoumou.gr/Login",
    handleCodeInApp: true,
  };

  try {
    const auth = getAuth();
    await auth.sendSignInLinkToEmail(email, actionCodeSettings);
    res.status(200).send("Verification email sent"); // Send a response
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email"); // Send an error response
  }
});


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
    const userRef = snapshotDB.ref(`/users/${userId}`);
    const snapshot = await userRef.once("value");
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


exports.getUserGeneralInfo = functions.https.onRequest(async (req, res) => {
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
  try {
    const {userId} = req.query; // Get userId from the request query

    // Call the internal functions to get user data
    const userDbInfo = await getUserDbInfo(userId);
    const userAuthInfo = await getUserAuthInfo(userId);

    // Combine the data into a single object
    const userGeneralInfo = {
      FirstName: userDbInfo.FirstName || userAuthInfo.firstName,
      LastName: userDbInfo.LastName || userAuthInfo.lastName,
      Username: userDbInfo.Username || userAuthInfo.username,
      Password: userDbInfo.Password || userAuthInfo.password,
      Email: userDbInfo.Email || userAuthInfo.email,
      PhoneNumber: userDbInfo.PhoneNumber || userAuthInfo.phoneNumber,
      serviceswithappointmentkey: userDbInfo.serviceswithappointmentkey ||
      userAuthInfo.serviceswithappointmentkey,
    };

    // Send the combined data as a JSON response
    console.log("User general info:", userGeneralInfo);
    res.json(userGeneralInfo);
  } catch (error) {
    console.error("Error getting user general info:", error);
    res.status(500).send("Error getting user general info");
  }
});

/**
 * Retrieves user information from the Realtime Database.
 *
 * @param {string} userId The user's ID.
 * @return {Promise<object>} A promise that resolves with the
 *  user's data from the Realtime Database, or throws an error
 * if the user is not found.
 */
async function getUserDbInfo(userId) {
  try {
    const response = await fetch(`https://us-central1-torantevoumou-86820.cloudfunctions.net/GetUserDBinfo?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error getting user info:", error);
    throw error; // Rethrow or handle as needed
  }
}


/**
 * Retrieves authentication information for a user.
 *
 * @param {string} userId The user's ID.
 * @return {Promise<{email: string, phoneNumber: string}>}
 * A promise that resolves with an object containing the user's
 *  email and phone number, or throws an error if the user is not found.
 */
async function getUserAuthInfo(userId) {
  try {
    const response = await fetch(`https://us-central1-torantevoumou-86820.cloudfunctions.net/GetUserAUTHinfo?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error getting user auth info:", error);
    throw error; // Rethrow or handle as needed
  }
}


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


exports.getServiceDetailedAppointments =
  functions.https.onRequest(async (req, res) => {
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

    console.log("getServiceDetiledAppointments function called");

    // Declare serviceName outside of the try block
    const serviceName = req.query.service;

    try {
      if (!serviceName) {
        return res.status(400).send("Service name is required");
      }

      const snapshotDB = await admin.database();
      const appRef = snapshotDB.ref(`/services/${serviceName}/appointments`);
      const snapshot = await appRef.once("value");
      const serviceAppointments = snapshot.val();

      if (serviceAppointments) {
        res.json({[serviceName]: serviceAppointments});
      } else {
        res.status(404).send(`No appointments found for service:
           ${serviceName}`);
      }
    } catch (error) {
      console.error(`Error listing appointments: ${serviceName}`, error);
      res.status(500).send(`Error listing appointments: ${serviceName}`);
    }
  });

exports.getServicesInfo = functions.https.onRequest(async (req, res) => {
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

  console.log("getServicesInfo function called");

  try {
    const snapshotDB = await admin.database();
    const servicesRef = snapshotDB.ref("/services");
    const snapshot = await servicesRef.once("value");
    const services = snapshot.val();

    if (services) {
      // Assuming you want to return information for all services
      const allServiceInfo = Object.keys(services)
          .reduce((acc, serviceName) => {
            const serviceInfo = services[serviceName].info;
            acc[serviceName] = serviceInfo;
            return acc;
          }, {});

      res.json(allServiceInfo);
    } else {
      res.status(404).send("No service information found");
    }
  } catch (error) {
    console.error("Error retrieving service information", error);
    res.status(500).send("Error retrieving service information");
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
    const serviceAppointments = req.body;
    const appointments = [];

    for (const service in serviceAppointments) {
      if (Object.prototype.hasOwnProperty.call(serviceAppointments, service)) {
        for (const appointmentId of serviceAppointments[service]) {
          const db = await admin.database();
          const path = `/services/${service}/appointments/${appointmentId}`;
          console.log(`Getting appointment from path: ${path}`);
          const snapshot = await db.ref(path).once("value");
          const appointment = snapshot.val();
          if (appointment) {
            // Modify the appointment object to include AID
            const modifiedAppointment = {
              AID: appointmentId, // Add AID property
              appointmentDate: appointment.appointmentDate,
              appointmentTime: appointment.appointmentTime,
            };
            appointments.push(modifiedAppointment);
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
    // Add the appointment to the services table under the "appointments" child
    const appointmentsRef = servicesRef.child(
        `${serviceName}/appointments`).push();

    await appointmentsRef.set({
      UID: UserId,
      appointmentDate,
      appointmentTime,
    });

    // Get the generated key for the appointment
    const appointmentKey = appointmentsRef.key;

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
    const serviceNames = Object.keys(services);

    console.log("Services fetched successfully:", serviceNames);

    res.json(serviceNames); // Return the array of service names
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({error: "Internal server error"});
  }
});
