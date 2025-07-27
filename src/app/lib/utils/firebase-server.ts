// lib/firebase/admin.js
// This file is for server-side use only (e.g., Server Components, Route Handlers)
import * as admin from 'firebase-admin';

// Initialize Firebase Admin only if it hasn't been initialized yet
if (!admin.apps.length) {
  // Use environment variables for sensitive credentials
  // Ensure your service account JSON file is securely handled and its contents
  // are split into environment variables.
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Handle newline chars for private key
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

const adminDb = admin.firestore();

export { adminDb };