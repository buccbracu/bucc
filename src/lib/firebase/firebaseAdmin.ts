import admin from "firebase-admin";

if (!admin.apps.length) {
  // Parse the service key from the environment variable
  const serviceAccount = JSON.parse(`${process.env.NEXT_PUBLIC_FIREBASE_SERVICE_KEY}`);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;

