import { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth,
  logIn,
  googleLogin,
  logOut,
  onAuthChange,
  sendEmailVerification
} from '../utils/firebase';
import { createUserProfile, getUserData } from '../services/userService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        await createUserProfile(user);
        const userDoc = await getUserData(user.uid);
        setUserData(userDoc);
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    login: async (email, password) => {
      try {
        setLoading(true);
        const user = await logIn(email, password);
        return user;
      } finally {
        setLoading(false);
      }
    },
    googleLogin: async () => {
      try {
        setLoading(true);
        const user = await googleLogin();
        return user;
      } finally {
        setLoading(false);
      }
    },
    logout: async () => {
      await logOut();
      setCurrentUser(null);
      setUserData(null);
    },
    sendEmailVerification,
    refreshUser: async () => {
      await auth.currentUser?.reload();
      setCurrentUser({ ...auth.currentUser });
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};