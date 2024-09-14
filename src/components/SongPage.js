import "./SongPage.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import PageNotFound from "./404";

const SongPage = () => {
  const { pollId, songId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [song, setSong] = useState(null);

  useEffect(() => {
    const getSongDetails = async () => {
      setIsLoading(true);
      const songRef = doc(db, "polls", pollId, "songs", songId);
      const songSnap = await getDoc(songRef);
      if (songSnap.exists()) {
        setSong(songSnap.data());
      }
      setIsLoading(false);
    };
    getSongDetails();
  }, [pollId, songId]);

  if (isLoading) {
    return (
      <div className="d-flex flex-column align-items-center mx-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (!song) {
    return <PageNotFound />;
  }

  return (
    <div className="d-flex flex-column align-items-center mx-4">
      <h1 className="text-white text-uppercase fs-2 mb-4 text-center">
        {song.title}
      </h1>
      <ul className="list-unstyled d-flex flex-column gap-2 fs-5">
        <li>Artysta: {song.artist}</li>
        <li>Gatunek: {song.genre}</li>
        <li>
          <a
            href={song.url}
            className="link-song fw-400"
            target="_blank"
            rel="noreferrer"
          >
            Posłuchaj teraz
          </a>
        </li>
        <li className="song-votes">Ilość głosów: {song.votes}</li>
      </ul>
    </div>
  );
};

export default SongPage;
