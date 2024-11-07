import "./VotePage.css";
import { useEffect, useContext, useState, useRef } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import usePoll from "../hooks/usePoll";
import useVoteSong from "../hooks/useVoteSong";
import AuthContext from "../context/AuthProvider";
import AlertContext from "../context/AlertProvider";
import { useModal } from "../context/ModalProvider";
import { useNavigate, Link } from "react-router-dom";

const VotePage = ({ type }) => {
  const voteType = type === "weekly" ? "Tygodnia" : "Miesiąca";
  const auth = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);
  const { openModal, closeModal } = useModal();
  const [songId, setSongId] = useState(null);
  const timer = useRef(null);
  const [isLoadingVote, setLoadingVote] = useState(true);
  const [pollEnded, setPollEnded] = useState(false);
  const navigate = useNavigate();

  const { isLoading, poll, incrementSongVote } = usePoll(type);
  const { voteForSong } = useVoteSong(
    poll?.id,
    voteType,
    setSongId,
    incrementSongVote
  );

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
        const userVoteRef = doc(db, "users", auth.user.uid, "votes", poll.id);
        const userVoteDoc = await getDoc(userVoteRef);
        if (userVoteDoc.exists()) {
          // Show only today's voted song
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const lastVoteTime = userVoteDoc.data().timestamp?.toDate();
          if (lastVoteTime >= today) {
            setSongId(userVoteDoc.data().songId);
          } else {
            setSongId(null);
          }
        } else {
          setSongId(null);
        }
      }
      setLoadingVote(false);
    };
    getUserVote();
  }, [poll?.id, auth.user]);

  const confirmVote = (song) => {
    if (!auth.user) {
      return navigate("/login");
    }
    if (songId) {
      return addAlert(
        `Już dzisiaj głosowałeś na piosenkę ${voteType.toLowerCase()}`,
        "warning"
      );
    }
    openModal({
      title: `Potwierdź swój wybór`,
      body: `Zaakceptuj swój wybór na ${song.title} artysty ${song.artist} w głosowaniu ${voteType}`,
      buttons: [
        {
          label: "Akceptuj",
          type: "success",
          action: () => {
            closeModal();
            voteForSong(song.id);
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
                        alt="Najczęsciej głosowana piosenka"
                        className="stars z-3"
                        width="50"
                      ></img>
                    )}
                    <p className="text-white fs-3 m-0 vote-enumeration">
                      {i + 1}.
                    </p>
                    <li
                      className={`position-relative w-100 border border-2 border-success rounded-5 fs-6 m-0 p-2 p-sm-0 row align-items-center justify-content-center row-gap-2 me-4 flex-wrap-reverse ${i === 0 ? "border-bottom-2 bg-top-vote-opaque" : "bg-vote-opaque"}`}
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
                        className={`${pollEnded ? "vote-bar-ended" : "vote-bar"} row col-12 col-sm justify-content-center m-0 vote-text`}
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
