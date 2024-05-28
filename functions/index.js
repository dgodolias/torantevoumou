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

exports.updateUser = functions.https.onRequest(async (req, res) => {
  try {
    const {userId, changes} = req.body;
    await admin.database().ref(`/users/${userId}`).update(changes);
    res.status(200).send("User updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Error updating user");
  }
});

exports.deleteUser = functions.https.onRequest(async (req, res) => {
  try {
    const {id} = req.body;
    await admin.database().ref(`/users/${id}`).remove();
    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Error deleting user");
  }
});

exports.getServiceAppointments = functions.https.onRequest(async (req, res) => {
  try {
    const {serviceId} = req.body;
    const ref = admin.database().ref(`/appointments/${serviceId}`);
    const snapshot = await ref.once("value");
    const appointments = snapshot.val();
    res.json(appointments);
  } catch (error) {
    console.error("Error getting service appointments:", error);
    res.status(500).send("Error getting service appointments");
  }
});

exports.addUser = functions.https.onRequest(async (req, res) => {
  try {
    const {user} = req.body;
    const newUserRef = await admin.database().ref("/users").push();
    await newUserRef.set(user);
    res.status(200).send("User added successfully");
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).send("Error adding user");
  }
});

exports.getAppointment = functions.https.onRequest(async (req, res) => {
  try {
    const {appointmentId} = req.body;
    const ref = admin.database().ref(`/appointments/${appointmentId}`);
    const snapshot = await ref.once("value");
    const appointment = snapshot.val();
    res.json(appointment);
  } catch (error) {
    console.error("Error getting appointment:", error);
    res.status(500).send("Error getting appointment");
  }
});

exports.getServiceNames = functions.https.onRequest(async (req, res) => {
  try {
    const snapshot = await admin.database().ref("/services").once("value");
    const services = snapshot.val();
    const serviceNames = Object.values(services).map((service) => service.name);
    res.json(serviceNames);
  } catch (error) {
    console.error("Error getting service names:", error);
    res.status(500).send("Error getting service names");
  }
});
