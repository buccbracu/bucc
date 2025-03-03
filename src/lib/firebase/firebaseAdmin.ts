import admin from "firebase-admin";

if (!admin.apps.length) {
  // Parse the service key from the environment variable
  const key = process.env.NEXT_PUBLIC_FIREBASE_SERVICE_KEY as string
  const serviceAccount = JSON.parse(key);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;

