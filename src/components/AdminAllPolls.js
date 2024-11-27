import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import AllPoll from "./AllPoll";
import { useAlert } from "../context/AlertProvider";
import {
  togglePollStatus,
  toggleAnonymousVoting,
  checkPollStatus,
} from "../hooks/useAdminPanel";

const AdminAllPolls = () => {
  const handleViewPoll = (poll) => {};
  const { addAlert } = useAlert();
  const [allPolls, setAllPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const pollsCollection = collection(db, "polls");
        const querySnapshot = await getDocs(pollsCollection);
        const polls = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllPolls(polls);
      } catch (error) {
        addAlert("Błąd podczas pobierania głosowań: " + error.message, "error");
        addAlert("Wystąpił błąd podczas pobierania głosowań", "error");
      }
    };
    fetchPolls();
  }, [addAlert]);

  const handleTogglePollStatus = async (poll) => {
    try {
      const activeWeekly = allPolls.find(
        (p) => p.type === "weekly" && p.published && p.id !== poll.id
      );
      const activeMonthly = allPolls.find(
        (p) => p.type === "monthly" && p.published && p.id !== poll.id
      );

      if (poll.published === false) {
        if (poll.type === "weekly" && activeWeekly) {
          addAlert("Istnieje już aktywne głosowanie tygodnia. ", "error");
          return;
        }
        if (poll.type === "monthly" && activeMonthly) {
          addAlert("Istnieje już aktywne głosowanie miesiąca. ", "error");
          return;
        }
      }

      const message = await togglePollStatus(poll.id, checkPollStatus(poll));
      addAlert(message, "success");
      const pollsCollection = collection(db, "polls");
      const querySnapshot = await getDocs(pollsCollection);
      const updatedPolls = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllPolls(updatedPolls);
    } catch (error) {
      addAlert(
        "Błąd podczas zmiany statusu publikacji: " + error.message,
        "error"
      );
    }
  };

  const handleToggleAnonymousVoting = async (poll) => {
    try {
      const message = await toggleAnonymousVoting(
        poll.id,
        poll.anonymousVoting
      );
      addAlert(message, "success");
      const pollsCollection = collection(db, "polls");
      const querySnapshot = await getDocs(pollsCollection);
      const updatedPolls = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllPolls(updatedPolls);
    } catch (error) {
      addAlert(
        "Błąd podczas zmiany statusu anonimowego głosowania: " + error.message,
        "error"
      );
    }
  };

  return (
    <div>
      <h2>Wszystkie głosowania</h2>
      <div className="d-flex flex-column gap-4">
        {allPolls.length > 0 ? (
          allPolls.map((poll) => (
            <div key={poll.id}>
              <h5>
                {poll.type === "weekly"
                  ? "Głosowanie Tygodnia"
                  : "Głosowanie Miesiąca"}
              </h5>
              <AllPoll
                poll={poll}
                handleTogglePollStatus={handleTogglePollStatus}
                handleToggleAnonymousVoting={handleToggleAnonymousVoting}
              />
            </div>
          ))
        ) : (
          <p>Ładowanie głosowań...</p>
        )}
      </div>
    </div>
  );
};

export default AdminAllPolls;
