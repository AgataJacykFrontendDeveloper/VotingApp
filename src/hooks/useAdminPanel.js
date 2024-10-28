import {
  getDocs,
  updateDoc,
  doc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export const getUserList = async () => {
  try {
    const query = await getDocs(collection(db, "users"));
    const users = query.docs.map((doc) => ({
      id: doc.id,
      email: doc.data().email,
      isAdmin: doc.data().isAdmin || false,
      isBlocked: doc.data().isBlocked || false,
    }));
    return users;
  } catch (error) {
    console.log("Błąd podczas pobierania użytkowników: ", error);
    throw error;
  }
};

export const getPollList = async () => {
  try {
    const votesRef = collection(db, "polls");
    const queryWeekly = query(votesRef, where("type", "==", "weekly"));
    const querySnapshotWeekly = await getDocs(queryWeekly);
    const WeeklyRecord = querySnapshotWeekly.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))[0];
    const queryMonthly = query(votesRef, where("type", "==", "monthly"));
    const querySnapshotMonthly = await getDocs(queryMonthly);
    const MonthlyRecord = querySnapshotMonthly.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))[0];

    return { WeeklyRecord, MonthlyRecord };
  } catch (error) {
    console.log("Błąd podczas pobierania listy głosowań: ", error);
    throw error;
  }
};

export const viewPoll = async (pollId) => {
  const querySnapshot = await getDocs(collection(db, "polls", pollId, "songs"));
  const pollsArray = [];
  querySnapshot.forEach((doc) => {
    pollsArray.push({
      id: doc.id,
      data: doc.data(),
    });
  });
  return pollsArray;
};

export const updateVotes = async (pollId, songId, votes) => {
  try {
    const songRef = doc(db, "polls", pollId, "songs", songId);
    await updateDoc(songRef, { votes });
    return "Pomyślnie zaktualizowano głosy!";
  } catch (error) {
    throw new Error("Błąd podczas aktualizowania głosów: " + error.message);
  }
};

export const checkPollStatus = (poll) => {
  return poll.published === true;
};

export const togglePollStatus = async (pollId, currentStatus) => {
  try {
    const pollRef = doc(db, "polls", pollId);
    await updateDoc(pollRef, {
      published: !currentStatus,
    });
    return "Status publikacji zaktualizowany!";
  } catch (error) {
    console.log("Błąd podczas aktualizacji statusu publikacji: ", error);
    throw error;
  }
};

export const blockUser = async (userId, status) => {
  try {
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      isBlocked: status,
    });
    return true;
  } catch (error) {
    console.log("Błąd podczas blokowania użytkownika: ", error);
    return false;
  }
};
