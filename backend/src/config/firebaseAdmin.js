const admin = require('firebase-admin');

// Initialize Firebase Admin with project credentials
// Using applicationDefault() looks for GOOGLE_APPLICATION_CREDENTIALS env var,
// or falls back to project-level config on GCP/Firebase Hosting.
// For local dev you can also pass a service account JSON directly.
const firebaseApp = admin.initializeApp({
  projectId: 'flashbites-shop',
});

/**
 * Verify a Firebase ID token obtained from the client after phone auth.
 * Returns the decoded token containing uid and phone_number.
 */
const verifyFirebaseToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Firebase token verification failed:', error.message);
    return null;
  }
};

module.exports = { admin, firebaseApp, verifyFirebaseToken };
