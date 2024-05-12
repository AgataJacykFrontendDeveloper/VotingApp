import { useState, useEffect, createContext } from "react";
import { auth } from "../firebase/firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";

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
  const signupUser = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  return (
    <AuthContext.Provider value={{ user, signupUser }}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
