import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYDGzfDPi-bd4eDW0lmVL2I6Kqlzt7jqQ",
  authDomain: "auth-demo-223f7.firebaseapp.com",
  projectId: "auth-demo-223f7",
  storageBucket: "auth-demo-223f7.firebasestorage.app",
  messagingSenderId: "814857504914",
  appId: "1:814857504914:web:732ffa739f8b34ccd5be4b",
  measurementId: "G-TBN94GN999"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
