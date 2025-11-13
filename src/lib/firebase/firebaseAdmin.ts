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
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } catch (error) {
      console.warn("Failed to initialize Firebase Admin:", error);
    }
  }
}

export async function uploadToFirebase(file: File, folder: string): Promise<string> {
  if (!admin.apps.length) {
    throw new Error("Firebase Admin not initialized");
  }

  const bucket = admin.storage().bucket();
  const fileName = `${folder}/${Date.now()}-${file.name}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  
  const fileUpload = bucket.file(fileName);
  
  await fileUpload.save(fileBuffer, {
    metadata: {
      contentType: file.type,
    },
  });

  await fileUpload.makePublic();
  
  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
}

export default admin;

