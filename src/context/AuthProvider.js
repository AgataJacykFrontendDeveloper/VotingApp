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
  const [isLoading, setIsLoading] = useState(false);
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

  function checkErrorMessage(e) {
    const errorCode = e.code;
    return errorMessages[errorCode] || errorMessages["auth/unexpected-error"];
  }

  useEffect(() => {
    const currentUser = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return currentUser;
  }, []);

  const getOAuthResult = async () => {
    if (sessionStorage.getItem("oauthRedirect") === "true") {
      setIsLoading(true);
      try {
        const userCredential = await getRedirectResult(auth);
        if (userCredential) {
          // TODO: Disallow login redirect if user already changed page
          navigate(LOGIN_REDIRECT);
        }
      } catch (error) {
        throw new Error(checkErrorMessage(error));
      } finally {
        sessionStorage.removeItem("oauthRedirect");
        setIsLoading(false);
      }
    }
  };

  // Authentication related functions
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    sessionStorage.setItem("oauthRedirect", "true");
    signInWithRedirect(auth, provider);
  };

  const signInWithTwitter = async () => {
    const provider = new TwitterAuthProvider();
    sessionStorage.setItem("oauthRedirect", "true");
    signInWithRedirect(auth, provider);
  };

  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    sessionStorage.setItem("oauthRedirect", "true");
    signInWithRedirect(auth, provider);
  };

  const signIn = async (email, password) => {
    setIsLoading(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User successfully signed in
        navigate(LOGIN_REDIRECT);
      })
      .catch((error) => {
        // Check type of error message and display according text
        throw new Error(checkErrorMessage(error));
      })
      .finally(() => {
        setIsLoading(false);
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
        isLoading,
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
