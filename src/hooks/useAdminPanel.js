import {
  getDocs,
  updateDoc,
  doc,
  collection,
  query,
  limit,
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
    const queryWeekly = query(
      votesRef,
      where("type", "==", "weekly"),
      limit(1)
    );
    const querySnapshotWeekly = await getDocs(queryWeekly);
    const WeeklyRecord = querySnapshotWeekly.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))[0];
    const queryMonthly = query(
      votesRef,
      where("type", "==", "monthly"),
      limit(1)
    );
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

export const updatePoll = async (pollId, pollData) => {
  try {
    const pollRef = doc(db, "polls", pollId);
    await updateDoc(pollRef, { ...pollData });
    return "Pomyślnie zaktualizowano głosowanie!";
  } catch (error) {
    throw new Error("Błąd podczas aktualizowania głosowania: " + error.message);
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
    throw new Error(
      "Błąd podczas aktualizacji statusu publikacji: ",
      error.message
    );
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

export const getUserVotes = async () => {
  try {
    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);

    const allVotes = [];

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const email = userData.email;

      const votesCollection = collection(db, "users", userDoc.id, "votes");
      const votesSnapshot = await getDocs(votesCollection);

      const votesArray = votesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      allVotes.push({
        email: email,
        votes: votesArray,
      });
    }

    return allVotes;
  } catch (error) {
    console.error("Błąd podczas pobierania listy oddanych głosów:", error);
    return [];
  }
};

export const getSongsInfo = async () => {
  try {
    const pollsCollection = collection(db, "polls");
    const pollsSnapshot = await getDocs(pollsCollection);

    const allSongs = {};

    for (const pollDoc of pollsSnapshot.docs) {
      const songsCollection = collection(db, "polls", pollDoc.id, "songs");
      const songsSnapshot = await getDocs(songsCollection);

      songsSnapshot.forEach((songDoc) => {
        allSongs[songDoc.id] = {
          artist: songDoc.data().artist,
          title: songDoc.data().title,
        };
      });
    }

    return allSongs;
  } catch (error) {
    console.error("Błąd podczas pobierania danych piosenek:", error);
    return {};
  }
};
