const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.getUsers = functions.https.onRequest(async (req, res) => {
  const listAllUsers = async (nextPageToken) => {
    // List batch of users, 1000 at a time.
    const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
    const users = listUsersResult.users.reduce((acc, user) => {
      acc[user.uid] = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        disabled: user.disabled,
      };
      return acc;
    }, {});
    if (listUsersResult.pageToken) {
      // List next batch of users.
      return {...users, ...(await listAllUsers(listUsersResult.pageToken))};
    }
    return users;
  };

  try {
    const users = await listAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error listing users:", error);
    res.status(500).send("Error listing users");
  }
});
