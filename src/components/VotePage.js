import "./VotePage.css";
import { useEffect, useContext, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import useFetchSongs from "../hooks/useFetchSongs";
import useVoteSong from "../hooks/useVoteSong";
import AuthContext from "../context/AuthProvider";
import AlertContext from "../context/AlertProvider";
import { useModal } from "../context/ModalProvider";
import { useNavigate } from "react-router-dom";

const VotePage = ({ type }) => {
  const voteType = type === "weekly" ? "Tygodnia" : "Miesiąca";
  const auth = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);
  const { openModal, closeModal } = useModal();
  const [songId, setSongId] = useState(null);
  const navigate = useNavigate();

  const { isLoading, songs, currentPollId, setSongs } = useFetchSongs(type);
  const { voteForSong } = useVoteSong(
    currentPollId,
    setSongs,
    voteType,
    setSongId
  );

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
      heading: `Potwierdź swój wybór`,
      text: `Zaakceptuj swój wybór na ${song.title} artysty ${song.artist} w głosowaniu ${voteType}`,
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

  useEffect(() => {
    async function getUserVote() {
      if (auth.user && currentPollId) {
        const userVoteRef = doc(
          db,
          "users",
          auth.user.uid,
          "votes",
          currentPollId
        );
        const userVoteDoc = await getDoc(userVoteRef);
        if (userVoteDoc.exists()) {
          // Show only today's voted song
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const lastVoteTime = userVoteDoc.data().timestamp?.toDate();
          if (lastVoteTime >= today) {
            setSongId(userVoteDoc.data().songId);
          }
        } else {
          setSongId(null);
        }
      }
    }
    getUserVote();
  }, [currentPollId, auth.user]);

  return (
    <div className="d-flex flex-column align-items-center mx-4">
      <h1 className="text-white text-uppercase fs-2 mb-4 text-center">
        Zagłosuj na piosenkę {voteType}
      </h1>
      <ul className="list-unstyled fs-4 container-md d-flex flex-column gap-4 p-0">
        {!isLoading &&
          songs
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
                <p className="text-white fs-3 m-0 vote-enumeration">{i + 1}.</p>
                <li
                  className={`position-relative w-100 border border-2 border-success rounded-5 fs-6 m-0 p-2 p-sm-0 row align-items-center justify-content-center row-gap-2 me-4 flex-wrap-reverse ${i === 0 ? "border-bottom-2 bg-top-vote-opaque" : "bg-vote-opaque"}`}
                >
                  <button
                    className="btn-heart py-1 px-3 w-auto col-12 col-sm-auto"
                    onClick={() => confirmVote(song)}
                  >
                    {songId === song.id ? <>&#9829;</> : <>&#9825;</>}
                  </button>
                  <div className="vote-bar row col-12 col-sm justify-content-center m-0">
                    <div className="col-sm text-center text-sm-start row row-cols-1 column-gap-1">
                      <div className="col col-sm-auto px-0 text-break">
                        {song.title}
                      </div>
                      <div className="col col-sm-auto px-0">{song.artist}</div>
                    </div>
                    <small className="text-white col-auto text-nowrap me-0 me-sm-3 align-self-center">
                      Głosy: {song.votes}
                    </small>
                  </div>
                </li>
              </div>
            ))}
      </ul>
    </div>
  );
};

export default VotePage;
