import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthProvider";

const NewsletterCheckbox = () => {
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptionStatus = async () => {
    if (!user) return;

    try {
      const docRef = doc(db, "newsletter", user.email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setIsSubscribed(true);
      } else {
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error("Error fetching subscription status:", error);
    }
    setLoading(false);
  };

  const handleCheckboxChange = async () => {
    setIsSubscribed(!isSubscribed);

    try {
      if (!isSubscribed) {
        await setDoc(doc(db, "newsletter", user.email), {
          email: user.email,
        });
      } else {
        await deleteDoc(doc(db, "newsletter", user.email));
      }
    } catch (error) {
      console.error("Error updating subscription status:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSubscriptionStatus();
    }
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        value=""
        id="flexCheckDefault"
        checked={isSubscribed}
        onChange={handleCheckboxChange}
      />
      <label className="fw-bold form-check-label" htmlFor="flexCheckDefault">
        Zapis do newslettera
      </label>
    </div>
  );
};

export default NewsletterCheckbox;
