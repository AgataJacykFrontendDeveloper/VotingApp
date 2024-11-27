import { useState, useEffect } from "react";
import { getUserVotes, getSongsInfo } from "../hooks/useAdminPanel";
const AdminGetVotes = () => {
  const [votes, setVotes] = useState([]);
  const [songs, setSongs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const votesData = await getUserVotes();
        const songsData = await getSongsInfo();
        setVotes(votesData);
        setSongs(songsData);
      } catch (error) {
        setError("Nie udało się załadować danych.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Oddane głosy</h2>
      {loading ? (
        <p>Ładowanie danych...</p>
      ) : error ? (
        <p>{error}</p>
      ) : votes.length > 0 ? (
        <ul>
          {votes.map((user, index) => (
            <li key={index}>
              <strong>Użytkownik:</strong> {user.email}
              <ul>
                {user.votes.map((vote) => {
                  const song = songs[vote.songId] || {};
                  return (
                    <li key={vote.id}>
                      {/* TODO: Obsługa przycisku do usuwania głosu */}
                      <button className="btn btn-outline-danger">x</button>{" "}
                      {song.artist || "Nieznany"} - {song.title || "Nieznany"} (
                      {vote.timestamp
                        ? vote.timestamp.toLocaleString()
                        : "Brak daty"}
                      ) [Głosowanie: {vote.id}]
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>Brak oddanych głosów.</p>
      )}
    </div>
  );
};

export default AdminGetVotes;
