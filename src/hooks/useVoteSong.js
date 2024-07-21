import { useContext, useRef, useEffect } from "react";
import {
  getDoc,
  setDoc,
  doc,
  increment,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import AuthContext from "../context/AuthProvider";
import AlertContext from "../context/AlertProvider";
import { useNavigate } from "react-router-dom";

const useVoteSong = (currentPollId, setSongs, voteType, setSongId) => {
  const auth = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);
  const userVoted = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Reset userVoted if poll was changed
    userVoted.current = false;
  }, [currentPollId]);

  const getUserVote = async (userId) => {
    // Early return if user already voted for this poll
    if (userVoted.current) {
      return { voted: true, userVoteRef: null };
    }

    const userVoteRef = doc(db, "users", userId, "votes", currentPollId);
    const userVoteDoc = await getDoc(userVoteRef);
    // Users can vote only once a day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (userVoteDoc.exists()) {
      const lastVoteTime = userVoteDoc.data().timestamp?.toDate();
      // Check if user can vote on new day starting at 00:00
      return { voted: lastVoteTime >= today, userVoteRef };
    }
    // Set voted to false if user does not have any votes
    return { voted: false, userVoteRef };
  };

  const voteForSong = async (songId) => {
    if (!auth.user) {
      return navigate("/login");
    }
    const userId = auth.user.uid;

    const { voted, userVoteRef } = await getUserVote(userId);

    // Prevent unnecessary calls to firebase if user spams button
    if (voted) {
      userVoted.current = true;
      return addAlert(
        `Już dzisiaj głosowałeś na piosenkę ${voteType.toLowerCase()}`,
        "warning"
      );
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
      setSongId(songId);
      addAlert(`Zagłosowałeś na piosenkę ${voteType.toLowerCase()}`, "success");
      await setDoc(userVoteRef, { songId: songId, timestamp: Timestamp.now() });
      userVoted.current = true;
    }
  };

  return voteForSong;
};

export default useVoteSong;
