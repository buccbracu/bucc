import admin from "firebase-admin";

if (!admin.apps.length) {
  // Parse the service key from the environment variable
  const key = process.env.NEXT_PUBLIC_FIREBASE_SERVICE_KEY as string;
  
  // Only initialize if we have a valid service key (not a placeholder)
  if (key && !key.startsWith("your_")) {
    try {
      const serviceAccount = JSON.parse(key);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      console.warn("Failed to initialize Firebase Admin:", error);
    }
  }
}

export default admin;

