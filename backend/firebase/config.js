const admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: "trusty-art-431605-m2", // Ensure this matches your project
});

module.exports = admin;
