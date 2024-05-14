import { useState, useEffect, createContext } from "react";
import { auth } from "../firebase/firebase.js";
import {
  signInWithRedirect,
  GoogleAuthProvider,
  TwitterAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return currentUser;
  }, []);

  // Authentication related functions
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  const signInWithTwitter = async () => {
    const provider = new TwitterAuthProvider();
    signInWithRedirect(auth, provider);
  };

  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    signInWithRedirect(auth, provider);
  };

  return (
    <AuthContext.Provider
      value={{ user, signInWithGoogle, signInWithTwitter, signInWithFacebook }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
