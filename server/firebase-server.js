const admin = require("firebase-admin");
const serviceAccount = require("./key.json"); // Update the path to your service account key JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Add any other necessary configuration options
});

const firestore = admin.firestore();

module.exports = firestore;
