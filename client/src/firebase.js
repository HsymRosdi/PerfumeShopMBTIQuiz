import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCoDYKWkalXrm-S4ujfAOpBNSMZgAXVGYw",
  authDomain: "perfumeshop-9bab2.firebaseapp.com",
  projectId: "perfumeshop-9bab2",
  storageBucket: "perfumeshop-9bab2.firebasestorage.app",
  messagingSenderId: "528503222584",
  appId: "1:528503222584:web:e97d692b117068238911cd",
//   measurementId: "G-VGTLGPCWWC"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;