import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '@/lib/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState({ id: 'cognita-study' });

  useEffect(() => {
    const unsubscribe = db.auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setIsLoadingAuth(true);
    try {
      const currentUser = await db.auth.signInWithGoogle();
      setUser(currentUser);
      setIsAuthenticated(true);
      return currentUser;
    } catch (err) {
      console.error("Google signin error:", err);
      setAuthError({ type: 'auth_failed', message: err.message });
      throw err;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const loginWithEmail = async (email, password) => {
    setIsLoadingAuth(true);
    try {
      const currentUser = await db.auth.signInWithEmail(email, password);
      setUser(currentUser);
      setIsAuthenticated(true);
      return currentUser;
    } catch (err) {
      console.error("Email signin error:", err);
      setAuthError({ type: 'auth_failed', message: err.message });
      throw err;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const signupWithEmail = async (email, password, fullName) => {
    setIsLoadingAuth(true);
    try {
      const currentUser = await db.auth.signUpWithEmail(email, password, fullName);
      setUser(currentUser);
      setIsAuthenticated(true);
      return currentUser;
    } catch (err) {
      console.error("Email signup error:", err);
      setAuthError({ type: 'auth_failed', message: err.message });
      throw err;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = async (shouldRedirect = true) => {
    await db.auth.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const navigateToLogin = () => {
    loginWithGoogle().catch(() => {});
  };

  const checkAppState = async () => {
    setIsLoadingAuth(false);
    setIsLoadingPublicSettings(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      loginWithGoogle,
      loginWithEmail,
      signupWithEmail,
      logout,
      navigateToLogin,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
