// Firebase configuration for FlashBites
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// All values injected from .env via Vite (must start with VITE_)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app = null;
let auth = null;

const ensureFirebaseAuth = () => {
  if (auth) return auth;

  // Avoid crashing the whole app if Firebase env vars are missing/invalid.
  if (!firebaseConfig.apiKey) {
    throw new Error("Firebase API key missing. Set VITE_FIREBASE_API_KEY in frontend .env.");
  }

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  return auth;
};

/**
 * Setup invisible reCAPTCHA verifier.
 * Call this before sending OTP. The #recaptcha-container element must exist in the DOM.
 */
export const setupRecaptcha = () => {
  const firebaseAuth = ensureFirebaseAuth();

  // Clear existing verifier to avoid conflicts on re-renders
  if (window.recaptchaVerifier) {
    try { window.recaptchaVerifier.clear(); } catch (e) { /* ignore */ }
    window.recaptchaVerifier = null;
  }

  window.recaptchaVerifier = new RecaptchaVerifier(
    firebaseAuth,
    "recaptcha-container",
    {
      size: "invisible",
      callback: () => {
        // reCAPTCHA solved - will proceed with OTP send
      },
      "expired-callback": () => {
        // Response expired - ask user to retry
        window.recaptchaVerifier = null;
      }
    }
  );

  return window.recaptchaVerifier;
};

/**
 * Send OTP to a phone number using Firebase Phone Auth.
 * @param {string} phoneNumber - e.g. "+911234567890"
 */
export const sendPhoneOTP = async (phoneNumber) => {
  const firebaseAuth = ensureFirebaseAuth();
  const appVerifier = window.recaptchaVerifier;
  if (!appVerifier) {
    throw new Error('reCAPTCHA not initialized. Call setupRecaptcha() first.');
  }

  try {
    const confirmationResult = await signInWithPhoneNumber(firebaseAuth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    return confirmationResult;
  } catch (error) {
    // Reset reCAPTCHA on error so user can retry
    if (window.recaptchaVerifier) {
      try { window.recaptchaVerifier.clear(); } catch (e) { /* ignore */ }
      window.recaptchaVerifier = null;
    }
    throw error;
  }
};

/**
 * Verify the OTP code.
 * @param {string} code - The 6-digit OTP
 * @returns {Promise<string>} Firebase ID token
 */
export const verifyPhoneOTP = async (code) => {
  if (!window.confirmationResult) {
    throw new Error('No OTP was sent. Please request OTP first.');
  }
  const result = await window.confirmationResult.confirm(code);
  return await result.user.getIdToken();
};

export { app, auth };
export default app;