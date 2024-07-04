import "./VotePage.css";
import { useEffect, useState, useContext } from "react";
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
  increment,
  updateDoc,
  orderBy,
  limit,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import AuthContext from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const VotePage = ({ type }) => {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [songs, setSongs] = useState([]);
  const [currentPollId, setCurrentPollId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true);
      try {
        // Get latest poll with type monthly | weekly
        const pollsCollectionRef = collection(db, "polls");
        const latestPollQuery = query(
          pollsCollectionRef,
          where("type", "==", type),
          orderBy("start_at", "desc"),
          limit(1)
        );
        const latestPollSnapshot = await getDocs(latestPollQuery);

        if (!latestPollSnapshot.empty) {
          const latestPollDoc = latestPollSnapshot.docs[0];
          setCurrentPollId(latestPollDoc.id);
          const songsSnapshot = await getDocs(
            collection(latestPollDoc.ref, "songs")
          );

          let allSongs = [];
          songsSnapshot.forEach((songDoc) => {
            let songData = songDoc.data();
            songData.id = songDoc.id;
            allSongs.push(songData);
          });
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
  }, [type]);

  const voteSong = async (songId) => {
    if (!auth.user) {
      return navigate("/login");
    }
    const userId = auth.user.uid;
    const userVoteRef = doc(db, "users", userId, "votes", currentPollId);
    const userVoteDoc = await getDoc(userVoteRef);
    // Users can vote only once a day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (userVoteDoc.exists()) {
      const lastVoteTime = userVoteDoc.data().timestamp.toDate();

      if (lastVoteTime >= today) {
        // TODO: Display notification for user to know that he voted already
        return console.log("You have already voted today");
      }
    }

    const songDocRef = doc(db, "polls", currentPollId, "songs", songId);
    const songDoc = await getDoc(songDocRef);

    if (songDoc.exists()) {
      updateDoc(songDocRef, { votes: increment(1) });
      // Update local votes state
      setSongs((prevSongs) =>
        prevSongs.map((song) =>
          song.id === songId ? { ...song, votes: song.votes + 1 } : song
        )
      );

      await setDoc(userVoteRef, { timestamp: Timestamp.now() });
    }
  };

  const voteType = () => {
    return type === "weekly" ? "Tygodnia" : "Miesiąca";
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <h1 className="text-white text-uppercase fs-2 mb-4">
        Zagłosuj na piosenkę {voteType()}
      </h1>
      <ul className="list-unstyled fs-4 container-md d-flex flex-column gap-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          songs
            .sort((a, b) => b.votes - a.votes)
            .map((song, i) => (
              <div
                className="d-flex align-items-center gap-4 position-relative"
                key={song.id}
              >
                {i === 0 && (
                  <img
                    src="/assets/images/stars.png"
                    alt="Top voted song"
                    className="stars"
                    width="50"
                  ></img>
                )}
                <p className="text-white fs-3 m-0">{i + 1}.</p>
                <li className="border border-success rounded-5 w-100 fs-6 row align-items-center">
                  <button
                    className="p-3"
                    style={{ width: "80px" }}
                    onClick={() => voteSong(song.id)}
                  >
                    like
                  </button>
                  <div className="col">
                    {song.title} {song.artist}
                  </div>
                  <span className="text-white col-2 col-lg-1 m-0">
                    Głosy: {song.votes}
                  </span>
                </li>
              </div>
            ))
        )}
      </ul>
    </div>
  );
};

export default VotePage;
