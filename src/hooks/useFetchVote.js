import { useEffect, useState, useCallback } from "react";
import { collection, getDocs, doc, getDoc, query } from "firebase/firestore";
import { db } from "../firebase/firebase";

const useFetchVotes = (userId) => {
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyVotes, setMonthlyVotes] = useState([]);
  const [weeklyVotes, setWeeklyVotes] = useState([]);

  const getUserVotes = useCallback(async () => {
    if (!userId) {
      console.error("Niepoprawny ID użytkownika: ", userId);
      return [];
    }

    const userVotesCollectionRef = collection(db, "users", userId, "votes");
    return await getDocs(userVotesCollectionRef);
  }, [userId]);

  const getSongDetails = useCallback(async (pollId, songId) => {
    try {
      const songDocRef = doc(db, "polls", pollId, "songs", songId);
      const songDoc = await getDoc(songDocRef);
      if (songDoc.exists()) {
        return { ...songDoc.data(), id: songDoc.id };
      } else {
        console.error("Nie znaleziono piosenki o ID: ", songId);
        return null;
      }
    } catch (error) {
      console.error("Szczegóły błędu: ", error);
      return null;
    }
  }, []);

  const getPollIdFromSongId = useCallback(async (songId) => {
    try {
      const pollsCollectionRef = collection(db, "polls");
      const pollsQuery = query(pollsCollectionRef);
      const pollsSnapshot = await getDocs(pollsQuery);

      for (const pollDoc of pollsSnapshot.docs) {
        const songsCollectionRef = collection(db, "polls", pollDoc.id, "songs");
        const songsSnapshot = await getDocs(songsCollectionRef);

        const songDoc = songsSnapshot.docs.find((song) => song.id === songId);
        if (songDoc) {
          return pollDoc.id;
        }
      }
      return null;
    } catch (error) {
      console.error("Błąd znalezienia PollID dopasowanego do SongID: ", error);
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchVotes = async () => {
      setIsLoading(true);
      try {
        const userVotesSnapshot = await getUserVotes();

        if (userVotesSnapshot && !userVotesSnapshot.empty) {
          const votesPromises = userVotesSnapshot.docs.map(async (voteDoc) => {
            const { songId, timestamp } = voteDoc.data();
            const pollId = await getPollIdFromSongId(songId);
            const songDetails = pollId
              ? await getSongDetails(pollId, songId)
              : null;
            return songDetails
              ? { ...voteDoc.data(), ...songDetails, voteId: voteDoc.id }
              : null;
          });

          const allVotes = await Promise.all(votesPromises);
          const filteredVotes = allVotes.filter((vote) => vote !== null);

          const now = new Date();
          const oneWeekAgo = new Date(now);
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          const oneMonthAgo = new Date(now);
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

          const weeklyVotes = filteredVotes.filter(
            (vote) => new Date(vote.timestamp.seconds * 1000) >= oneWeekAgo
          );
          const monthlyVotes = filteredVotes.filter(
            (vote) => new Date(vote.timestamp.seconds * 1000) >= oneMonthAgo
          );

          setWeeklyVotes(weeklyVotes);
          setMonthlyVotes(monthlyVotes);
        } else {
          setWeeklyVotes([]);
          setMonthlyVotes([]);
          console.error("Brak oddanych!");
        }
      } catch (error) {
        setWeeklyVotes([]);
        setMonthlyVotes([]);
        console.error("Błąd ze znalezieniem głosów użytkownika: ", error);
      }
      setIsLoading(false);
    };

    fetchVotes();
  }, [getUserVotes, getSongDetails, getPollIdFromSongId]);

  return { isLoading, weeklyVotes, monthlyVotes };
};

export default useFetchVotes;
