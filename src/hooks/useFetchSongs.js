import { useEffect, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const useFetchSongs = (type) => {
  const [isLoading, setIsLoading] = useState(true);
  const [songs, setSongs] = useState([]);
  const [currentPollId, setCurrentPollId] = useState(null);

  const getNewestPoll = useCallback(async () => {
    const pollsCollectionRef = collection(db, "polls");
    const latestPollQuery = query(
      pollsCollectionRef,
      where("type", "==", type),
      orderBy("start_at", "desc"),
      limit(1)
    );
    return await getDocs(latestPollQuery);
  }, [type]);

  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true);
      try {
        const latestPollSnapshot = await getNewestPoll();

        if (!latestPollSnapshot.empty) {
          const latestPollDoc = latestPollSnapshot.docs[0];
          setCurrentPollId(latestPollDoc.id);

          const songsSnapshot = await getDocs(
            collection(latestPollDoc.ref, "songs")
          );
          const allSongs = songsSnapshot.docs.map((songDoc) => ({
            ...songDoc.data(),
            id: songDoc.id,
          }));
          setSongs(allSongs);
        } else {
          setSongs([]);
          console.error("No polls were found!");
        }
      } catch (error) {
        setSongs([]);
        console.error("Error fetching poll data: ", error);
      }
      setIsLoading(false);
    };

    fetchSongs();
  }, [getNewestPoll]);

  return { isLoading, songs, currentPollId, setSongs };
};

export default useFetchSongs;
