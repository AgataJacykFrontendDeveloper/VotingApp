import React, { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const useNewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      try {
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
          setMessage("Ten adres e-mail jest już zapisany.");
        } else {
          await addDoc(collection(db, "newsletter"), { email });
          setMessage("Dziękujemy za zapisanie się do newslettera!");
        }
      } catch (error) {
        console.error("Error adding document: ", error);
        setMessage("Wystąpił błąd. Spróbuj ponownie.");
      }
    } else {
      setMessage("Proszę podać prawidłowy adres e-mail.");
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const checkEmailExists = async (email) => {
    const q = query(collection(db, "newsletter"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  return {
    handleSubmit,
    setEmail,
    email,
    message,
  };
};

export default useNewsletterSignup;
