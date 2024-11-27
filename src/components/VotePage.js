import "./VotePage.css";
import { useEffect, useContext, useState, useRef } from "react";
import {
  getDoc,
  doc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import usePoll from "../hooks/usePoll";
import useVoteSong from "../hooks/useVoteSong";
import AuthContext from "../context/AuthProvider";
import AlertContext from "../context/AlertProvider";
import { useModal } from "../context/ModalProvider";
import { Link } from "react-router-dom";

const VotePage = ({ type }) => {
  const voteType = type === "weekly" ? "Tygodnia" : "Miesiąca";
  const auth = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);
  const { openModal, closeModal } = useModal();
  const [songId, setSongId] = useState(null);
  const timer = useRef(null);
  const [isLoadingVote, setLoadingVote] = useState(true);
  const [pollEnded, setPollEnded] = useState(false);

  const { isLoading, poll } = usePoll(type);
  const { voteSong } = useVoteSong();

  useEffect(() => {
    if (!poll) return;
    setPollEnded(false);
    const calculateRemainingTime = () => {
      const now = Date.now();
      const endTime = poll?.end_at.toDate().getTime();
      if (now > endTime) {
        setPollEnded(true);
        clearInterval(timer.current);
      }
    };

    calculateRemainingTime();

    timer.current = setInterval(() => calculateRemainingTime(), 1000);

    return () => clearInterval(timer.current);
  }, [poll]);

  useEffect(() => {
    const getUserVote = async () => {
      setLoadingVote(true);
      if (auth.user && poll?.id) {
        try {
          const userVoteRef = doc(db, "users", auth.user.uid, "votes", poll.id);
          const userVoteDoc = await getDoc(userVoteRef);
          if (userVoteDoc.exists()) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const lastVoteTime = userVoteDoc.data().timestamp?.toDate();
            if (lastVoteTime && lastVoteTime >= today) {
              setSongId(userVoteDoc.data().songId);
            } else {
              setSongId(null);
            }
          } else {
            setSongId(null);
          }
        } catch (error) {
          console.error("Error getting user vote: ", error);
          addAlert(
            "Wystąpił błąd podczas pobierania głosu użytkownika.",
            "danger"
          );
        }
      }
      setLoadingVote(false);
    };
    getUserVote();
  }, [poll?.id, auth.user]);

  const confirmVote = async (song) => {
    if (!auth.user && poll?.anonymousVoting === false) {
      return addAlert(
        "Aby wziąć udział w głosowaniu, musisz się zalogować.",
        "warning"
      );
    }
    if (songId) {
      return addAlert(
        `Już dzisiaj głosowałeś na piosenkę ${voteType.toLowerCase()}`,
        "warning"
      );
    }
    openModal({
      title: "Potwierdź swój wybór",
      body: `Zaakceptuj swój wybór na ${song.title} artysty ${song.artist} w głosowaniu ${voteType}`,
      buttons: [
        {
          label: "Akceptuj",
          type: "success",
          action: async () => {
            closeModal();
            try {
              if (poll && poll.id) {
                const songRef = doc(db, "polls", poll.id, "songs", song.id);
                await updateDoc(songRef, {
                  votes: increment(1),
                });

                const userVoteRef = doc(
                  db,
                  "users",
                  auth.user.uid,
                  "votes",
                  poll.id
                );
                await setDoc(
                  userVoteRef,
                  {
                    songId: song.id,
                    timestamp: serverTimestamp(),
                  },
                  { merge: true }
                );

                setSongId(song.id);
                addAlert("Głos został oddany pomyślnie!", "success");
              }
            } catch (error) {
              console.error("Error voting: ", error);
              addAlert("Wystąpił błąd podczas oddawania głosu.", "danger");
            }
          },
        },
      ],
    });
  };

  return (
    <div className="d-flex flex-column align-items-center mx-4">
      <h1 className="text-white text-uppercase fs-2 mb-4 text-center">
        Zagłosuj na piosenkę {voteType}
      </h1>
      {!isLoading &&
        !isLoadingVote &&
        (!poll ? (
          <p className="text-white text-uppercase fw-medium fs-4 mb-4 text-center">
            Aktualnie nie ma aktywnego głosowania
          </p>
        ) : (
          <>
            <p className="text-white text-uppercase fw-medium fs-4 mb-4 text-center">
              Głosowanie {poll.title}
            </p>
            {pollEnded ? (
              <p className="text-white text-uppercase fs-5 mb-4 text-center">
                Głosowanie zakończone dnia:{" "}
                {poll.end_at?.toDate().toLocaleDateString()}
              </p>
            ) : (
              <p className="text-white text-uppercase fs-5 mb-4 text-center">
                Zakończenie: {poll.end_at?.toDate().toLocaleDateString()}
              </p>
            )}
            <ul className="list-unstyled fs-4 container-md d-flex flex-column gap-4 p-0">
              {poll.songs
                .sort((a, b) => b.votes - a.votes)
                .map((song, i) => (
                  <div
                    className="d-flex align-items-center gap-4 position-relative w-100"
                    key={song.id}
                  >
                    {i === 0 && (
                      <img
                        src="/assets/images/stars.png"
                        alt="Najczęściej głosowana piosenka"
                        className="stars z-3"
                        width="50"
                      ></img>
                    )}
                    <p className="text-white fs-3 m-0 vote-enumeration">
                      {i + 1}.
                    </p>
                    <li
                      className={`position-relative w-100 border border-2 border-success rounded-5 fs-6 m-0 p-2 p-sm-0 row align-items-center justify-content-center row-gap-2 me-4 flex-wrap-reverse ${
                        i === 0
                          ? "border-bottom-2 bg-top-vote-opaque"
                          : "bg-vote-opaque"
                      }`}
                    >
                      <button
                        disabled={pollEnded}
                        hidden={pollEnded}
                        className="btn-heart py-1 px-3 w-auto col-12 col-sm-auto"
                        onClick={() => confirmVote(song)}
                      >
                        {songId === song.id ? <>&#9829;</> : <>&#9825;</>}
                      </button>
                      <Link
                        to={`/vote/${poll.id}/songs/${song.id}`}
                        className={`${
                          pollEnded ? "vote-bar-ended" : "vote-bar"
                        } row col-12 col-sm justify-content-center m-0 vote-text`}
                      >
                        <div className="col-sm text-center text-sm-start row row-cols-1 column-gap-1">
                          <div className="col col-sm-auto px-0 text-break">
                            {song.title}
                          </div>
                          <div className="col col-sm-auto px-0">
                            {song.artist}
                          </div>
                        </div>
                        <small className="text-white col-auto text-nowrap me-0 me-sm-3 align-self-center">
                          Głosy: {song.votes}
                        </small>
                      </Link>
                    </li>
                  </div>
                ))}
            </ul>
          </>
        ))}
    </div>
  );
};

export default VotePage;
