import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const getLatestPoll = async (type) => {
  const pollsCollectionRef = collection(db, "polls");
  const latestPollQuery = query(
    pollsCollectionRef,
    where("type", "==", type),
    orderBy("start_at", "desc"),
    limit(1)
  );
  const pollSnapshot = await getDocs(latestPollQuery);
  return pollSnapshot.docs[0] || null;
};

const getSongs = async (pollRef) => {
  const songsCollectionRef = collection(pollRef, "songs");
  const songsSnapshot = await getDocs(songsCollectionRef);
  return songsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

function usePoll(type) {
  const [poll, setPoll] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPollSongs = async () => {
      setIsLoading(true);
      try {
        const pollDoc = await getLatestPoll(type);

        if (pollDoc) {
          const songs = await getSongs(pollDoc.ref);
          setPoll({
            id: pollDoc.id,
            ...pollDoc.data(),
            songs,
          });
        } else {
          setPoll({});
          console.error("No polls found were found!");
        }
      } catch (error) {
        setPoll({});
        console.error("Error fetching poll data: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    getPollSongs();
  }, [type]);

  const incrementSongVote = (songId) => {
    setPoll((prev) => ({
      ...prev,
      songs: prev.songs.map((song) =>
        song.id === songId ? { ...song, votes: song.votes + 1 } : song
      ),
    }));
  };

  return { poll, isLoading, incrementSongVote };
}

export default usePoll;
