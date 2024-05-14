import { useState, useEffect, createContext } from "react";
import { auth } from "../firebase/firebase.js";
import {
  signInWithRedirect,
  GoogleAuthProvider,
  TwitterAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Error codes with displayed message
  const errorMessages = {
    "auth/invalid-credential": "Niepoprawne hasło. Proszę spróbuj ponownie",
    "auth/invalid-email": "Proszę wpisać prawidłowy adres e-mail",
    "auth/user-disabled":
      "To konto zostało wyłączone. Skontaktuj się z administratorem",
    "auth/too-many-requests": "Zbyt wiele prób. Spróbuj ponownie później",
    "auth/unexpected-error": "Wystąpił nieoczekiwany błąd. Spróbuj ponownie",
  };

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

  const signIn = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User successfully signed in
        return "Zalogowano się pomyślnie";
      })
      .catch((error) => {
        // Check type of error message and display according text
        const errorCode = error.code;
        const errorMessage =
          errorMessages[errorCode] || errorMessages["auth/unexpected-error"];
        return errorMessage;
      });
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        signInWithTwitter,
        signInWithFacebook,
        signIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
