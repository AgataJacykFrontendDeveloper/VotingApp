import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase.js";
import {
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  TwitterAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  signOut as signOutUser,
} from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const LOGIN_REDIRECT = "/";
  const SIGNOUT_REDIRECT = "/login";

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
    // Check if request was redirected from OAuth provider
    const currentUser = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return currentUser;
  }, []);

  const getOAuthResult = async () => {
    try {
      const userCredential = await getRedirectResult(auth);
      if (userCredential) {
        // TODO: Disallow login redirect if user already changed page
        navigate(LOGIN_REDIRECT);
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage =
        errorMessages[errorCode] || errorMessages["auth/unexpected-error"];
      throw new Error(errorMessage);
    }
  };

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
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User successfully signed in
        navigate(LOGIN_REDIRECT);
      })
      .catch((error) => {
        // Check type of error message and display according text
        const errorCode = error.code;
        const errorMessage =
          errorMessages[errorCode] || errorMessages["auth/unexpected-error"];
        throw new Error(errorMessage);
      });
  };

  const signOut = async () => {
    signOutUser(auth).then(() => {
      navigate(SIGNOUT_REDIRECT);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        signInWithTwitter,
        signInWithFacebook,
        signIn,
        signOut,
        getOAuthResult,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
