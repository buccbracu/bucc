import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = require("@/lib/firebase/firebase-service-key.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
