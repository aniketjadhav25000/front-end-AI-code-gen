import { db, serverTimestamp, sendEmailVerification } from '../utils/firebase';
import { 
  doc, 
  setDoc, 
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

export const createUserProfile = async (user, additionalData = {}) => {
  if (!user) return null;

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    try {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        ...additionalData
      });

      if (!user.emailVerified) {
        await sendEmailVerification(user);
      }
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  }

  return userRef;
};

export const getUserData = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

export const updateUserSettings = async (userId, settings) => {
  try {
    const settingsRef = doc(db, 'users', userId, 'private', 'settings');
    await setDoc(settingsRef, settings, { merge: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};

export const getUserPosts = async (userId) => {
  try {
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting user posts:", error);
    throw error;
  }
};