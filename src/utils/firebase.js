import { initializeApp } from "firebase/app";
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence,
  applyActionCode
} from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACibxqnIisczBov7pD8d_Z0v0y_FM-bkU",
  authDomain: "ai-code-gen-9d050.firebaseapp.com",
  projectId: "ai-code-gen-9d050",
  storageBucket: "ai-code-gen-9d050.appspot.com",
  messagingSenderId: "776124327520",
  appId: "1:776124327520:web:6a3092b16305afa805c505",
  measurementId: "G-VL1DJ5V14S"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Set session persistence
setPersistence(auth, browserSessionPersistence);

export async function signUp(email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCredential.user);
  return userCredential;
}

export async function logIn(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function googleLogin() {
  return await signInWithPopup(auth, googleProvider);
}

export async function logOut() {
  return await signOut(auth);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function verifyEmail(oobCode) {
  return await applyActionCode(auth, oobCode);
}

export { 
  auth, 
  db, 
  googleProvider,
  serverTimestamp,
  sendEmailVerification
};