import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase.js";
import { getDoc, doc } from "firebase/firestore";
import {
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  TwitterAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as signOutUser,
  sendPasswordResetEmail,
  confirmPasswordReset,
  deleteUser,
  verifyBeforeUpdateEmail,
  updatePassword,
} from "firebase/auth";

export const AuthContext = createContext();
auth.languageCode = "pl";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [idProvidera, setIdProvidera] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const LOGIN_REDIRECT = "/";
  const REGISTER_REDIRECT = "/";
  const SIGNOUT_REDIRECT = "/login";

  // Error codes with displayed message
  const errorMessages = {
    "auth/invalid-credential": "Niepoprawne hasło. Proszę spróbuj ponownie",
    "auth/invalid-email": "Proszę wpisać prawidłowy adres e-mail",
    "auth/user-disabled":
      "To konto zostało wyłączone. Skontaktuj się z administratorem",
    "auth/too-many-requests": "Zbyt wiele prób. Spróbuj ponownie później",
    "auth/unexpected-error": "Wystąpił nieoczekiwany błąd. Spróbuj ponownie",
    "auth/claims-too-large": "Nieprawidłowe żądanie. Spróbuj ponownie",
    "auth/email-already-exists": "Na ten adres e-mail jest już założone konto",
    "auth/email-already-in-use": "Na ten adres e-mail jest już założone konto",
    "auth/internal-error": "Błąd po stronie serwera. Spróbuj ponownie później",
    "auth/invalid-password": "Za słabe hasło. Musi być bardziej złożone",
    "auth/maximum-user-count-exceeded":
      "Osiągnieto maksymalną liczbę użytkowników. Poinformuj administratora",
    "auth/uid-already-exists": "UID użytkownika już istnieje",
    "auth/user-not-found":
      "Nie znaleziono użytkownika o takim adresie e-mail. Sprawdź poprawność wpisanego e-maila",
    "auth/invalid-action-code":
      "Kod weryfikacyjny jest nieprawidłowy lub wygaśnięty. Użyj funkcji ponownie",
    "auth/password-does-not-meet-requirements":
      "Hasło jest za słabe. Musi zawierać przynajmniej 8 znaków, wielką literę, cyfrę oraz znak specjalny",
    "auth/invalid-new-email":
      "Podany adres e-mail jest niepoprawny. Zweryfikuj go.",
    "auth/requires-recent-login": "Wymagana reautentykacja.",
  };

  function checkErrorMessage(e) {
    const errorCode = e.code;
    return errorMessages[errorCode] || errorMessages["auth/unexpected-error"];
  }

  const checkIsAdmin = async (user) => {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUser({ ...user, isAdmin: userDoc.data().isAdmin });
      } else {
        setUser({ ...user, isAdmin: false });
      }
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setUserEmail(authUser.providerData[0].email);
      /* TODO: Ustawienie ID Providera na nazwy zrozumiałe dla użytkownika */
      setIdProvidera(authUser.providerData[0].providerId);
      checkIsAdmin(authUser);
    });

    return () => {
      unsubscribe();
    };
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

  const signupUser = async (email, password) => {
    setIsLoading(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate(REGISTER_REDIRECT);
      })
      .catch((error) => {
        throw new Error(checkErrorMessage(error));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const forgotPassword = async (email) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      // Jeżeli w konsoli Firebase jest włączony email enumeration protection to zawsze zwracany jest taki sam request więc odpowiedź zawsze będzie taka sama
      return {
        message:
          "Jeżeli w bazie danych znajduje się ten e-mail, została na niego wysłana wiadomość z linkiem do resetowania hasła",
      };
    } catch (error) {
      throw new Error(checkErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (oobCode, newPassword) => {
    setIsLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      return {
        message:
          "Hasło zostało pomyślnie zresetowane. Możesz przejść do logowania",
      };
    } catch (error) {
      throw new Error(checkErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    signOutUser(auth).then(() => {
      navigate(SIGNOUT_REDIRECT);
    });
  };

  const removeAccount = async () => {
    deleteUser(auth.currentUser).then(() => {
      navigate(SIGNOUT_REDIRECT);
    });
  };

  const changeMail = async (newEmail) => {
    try {
      /* TODO: Wiadomość potwierdzająca zmianę maila + Reautentykacja (Firebase wymaga reautentykacji gdy użytkownik logował się dawno) */
      await verifyBeforeUpdateEmail(auth.currentUser, newEmail);
      return {
        message:
          "Na nowy adres e-mail została wysłana wiadomość do potwierdzenia zmiany.",
      };
    } catch (error) {
      throw new Error(checkErrorMessage(error));
    }
  };

  const changePassword = async (newPassword) => {
    try {
      /* TODO: Reautentykacja (Firebase wymaga reautentykacji gdy użytkownik logował się dawno) */
      await updatePassword(auth.currentUser, newPassword);
      return {
        message: "Twoje hasło zostało pomyślnie zmienione.",
      };
    } catch (error) {
      throw new Error(checkErrorMessage(error));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userEmail,
        idProvidera,
        isLoading,
        signInWithGoogle,
        signInWithTwitter,
        signInWithFacebook,
        signIn,
        signupUser,
        signOut,
        getOAuthResult,
        forgotPassword,
        resetPassword,
        removeAccount,
        changeMail,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
