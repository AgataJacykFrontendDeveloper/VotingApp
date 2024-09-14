import { useEffect, useState, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

const useFetchVotes = (userId) => {
  const [monthlyVotes, setMonthlyVotes] = useState([]);
  const [weeklyVotes, setWeeklyVotes] = useState([]);
  const [pollsMap, setPollsMap] = useState(new Map());
  const votesFetched = useRef(false);

  const fetchPollsAndSongs = async () => {
    if (pollsMap.size > 0) return pollsMap;

    const newPollsMap = new Map();
    const pollsSnapshot = await getDocs(collection(db, "polls"));

    await Promise.all(
      pollsSnapshot.docs.map(async (pollDoc) => {
        const songsSnapshot = await getDocs(
          collection(db, "polls", pollDoc.id, "songs")
        );
        const songsMap = new Map(
          songsSnapshot.docs.map((songDoc) => [songDoc.id, songDoc.data()])
        );
        newPollsMap.set(pollDoc.id, songsMap);
      })
    );

    setPollsMap(newPollsMap);
    return newPollsMap;
  };

  const getUserVotes = async () => {
    if (!userId) {
      console.error("Niepoprawny ID użytkownika: ", userId);
      return [];
    }

    const userVotesCollectionRef = collection(db, "users", userId, "votes");
    return await getDocs(userVotesCollectionRef);
  };

  useEffect(() => {
    const fetchVotes = async () => {
      if (votesFetched.current) {
        return;
      }

      try {
        const fetchedPollsMap = await fetchPollsAndSongs();
        const userVotesSnapshot = await getUserVotes();

        if (userVotesSnapshot && !userVotesSnapshot.empty) {
          const allVotes = userVotesSnapshot.docs.map((voteDoc) => {
            const { songId, timestamp } = voteDoc.data();
            for (const [pollId, songsMap] of fetchedPollsMap.entries()) {
              const songDetails = songsMap.get(songId);
              if (songDetails) {
                return {
                  ...voteDoc.data(),
                  ...songDetails,
                  voteId: voteDoc.id,
                };
              }
            }
            return null;
          });

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
          votesFetched.current = true;
        } else {
          setWeeklyVotes([]);
          setMonthlyVotes([]);
          console.error("Brak oddanych głosów!");
        }
      } catch (error) {
        setWeeklyVotes([]);
        setMonthlyVotes([]);
        console.error("Błąd ze znalezieniem głosów użytkownika: ", error);
      }
    };

    fetchVotes();
  }, [userId, pollsMap]);

  return { weeklyVotes, monthlyVotes };
};

export default useFetchVotes;
