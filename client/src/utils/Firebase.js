import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

const firebaseConfig = {
  apiKey: apiKey || "",
  authDomain: "loginfurever-877ae.firebaseapp.com",
  projectId: "loginfurever-877ae",
  storageBucket: "loginfurever-877ae.firebasestorage.app",
  messagingSenderId: "1030387403710",
  appId: "1:1030387403710:web:bdbe95736375c0c6b587ef",
};

let app = null;
let auth = null;
let provider = null;

try {
  if (apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    provider = new GoogleAuthProvider();
  } else {
    console.warn(
      "⚠️ VITE_FIREBASE_API_KEY is missing in client environment. Google Sign-In will require this key in client/.env"
    );
  }
} catch (error) {
  console.warn("Firebase initialization warning:", error.message);
}

export { auth, provider };
