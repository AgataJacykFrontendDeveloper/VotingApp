import {
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
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

    const queryWeekly = query(
      votesRef,
      where("type", "==", "weekly"),
      where("published", "==", true)
    );
    const querySnapshotWeekly = await getDocs(queryWeekly);
    const WeeklyRecord = querySnapshotWeekly.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))[0];

    const queryMonthly = query(
      votesRef,
      where("type", "==", "monthly"),
      where("published", "==", true)
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
      const uid = userDoc.id;

      const votesCollection = collection(db, "users", userDoc.id, "votes");
      const votesSnapshot = await getDocs(votesCollection);

      const votesArray = votesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      allVotes.push({
        email: email,
        uid: uid,
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
          id: songDoc.id,
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

export const toggleAnonymousVoting = async (pollId, currentStatus) => {
  try {
    const pollRef = doc(db, "polls", pollId);
    await updateDoc(pollRef, {
      anonymousVoting: !currentStatus,
    });
    return "Status anonimowego głosowania zaktualizowany!";
  } catch (error) {
    throw new Error(
      "Błąd podczas aktualizacji statusu anonimowego głosowania: " +
        error.message
    );
  }
};

export const getVotesForPoll = async (pollId) => {
  const pollRef = doc(db, "polls", pollId);
  const pollDoc = await getDoc(pollRef);

  if (!pollDoc.exists()) {
    return [];
  }

  const songsRef = collection(pollRef, "songs");
  const songsSnapshot = await getDocs(songsRef);

  if (songsSnapshot.empty) {
    return [];
  }

  const votesData = [];

  for (const songDoc of songsSnapshot.docs) {
    const songData = songDoc.data();
    const songId = songDoc.id;
    const songTitle = songData.title;
    const songArtist = songData.artist;
    const songVotes = songData.votes;
    const pollId = pollDoc.id;

    const usersRef = collection(db, "users");
    const userVotesData = [];

    const usersSnapshot = await getDocs(usersRef);
    for (const userDoc of usersSnapshot.docs) {
      const userVotesRef = doc(db, "users", userDoc.id, "votes", pollId);
      const userVotesDoc = await getDoc(userVotesRef);
      if (userVotesDoc.exists()) {
        const userVotes = userVotesDoc.data();
        if (userVotes && userVotes.songId === songId) {
          const userEmail = userDoc.data().email;

          const timestamp = userVotes.timestamp
            ? userVotes.timestamp.toDate()
            : null;

          userVotesData.push({
            userId: userDoc.id,
            userEmail,
            songId,
            songTitle,
            songArtist,
            songVotes,
            timestamp,
          });
        }
      }
    }

    if (userVotesData.length === 0) {
      votesData.push({
        songId,
        songTitle,
        songArtist,
        songVotes,
        usersVoted: [],
      });
    } else {
      votesData.push({
        songId,
        songTitle,
        songArtist,
        songVotes,
        pollId,
        usersVoted: userVotesData.map((vote) => ({
          userId: vote.userId,
          userEmail: vote.userEmail,
          userTimeStamp: vote.timestamp
            ? vote.timestamp.toLocaleString()
            : "N/A",
        })),
      });
    }
  }
  return votesData;
};

export const deleteVote = async (pollId, songId, uid) => {
  try {
    // Zmniejszanie liczby głosów o 1 w 'polls'
    const songRef = doc(db, "polls", pollId, "songs", songId);
    const songDoc = await getDoc(songRef);
    if (!songDoc.exists()) {
      throw new Error("Dokument piosenki nie istnieje w bazie danych.");
    }
    const songData = songDoc.data();
    const currentVotes = songData.votes;
    if (currentVotes > 0) {
      await updateDoc(songRef, { votes: currentVotes - 1 });
    } else {
      throw new Error("Nie można zmniejszyć głosów poniżej zera.");
    }
    // Usuwanie głosu użytkownika w 'users'
    const uservoteRef = doc(db, "users", uid, "votes", pollId);
    await deleteDoc(uservoteRef);
  } catch (error) {
    throw new Error("Błąd podczas usuwania głosu: " + error.message);
  }
};
