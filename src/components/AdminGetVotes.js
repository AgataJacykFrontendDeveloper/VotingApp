import { useState, useEffect, useContext } from "react";
import { getUserVotes, getSongsInfo, deleteVote } from "../hooks/useAdminPanel";
import AlertContext from "../context/AlertProvider";
const AdminGetVotes = () => {
  const [votes, setVotes] = useState([]);
  const [songs, setSongs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addAlert } = useContext(AlertContext);

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

  const handleDeleteVote = async (pollId, songId, uid) => {
    try {
      await deleteVote(pollId, songId, uid);
      setVotes((prevVotes) =>
        prevVotes.map((user) =>
          user.uid === uid
            ? {
                ...user,
                votes: user.votes.filter((vote) => vote.id !== pollId),
              }
            : user
        )
      );
      return addAlert("Głos został usunięty.");
    } catch (error) {
      console.error("Nie udało się usunąć głosu: ", error);
    }
  };

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
              <strong>Użytkownik:</strong> {user.email} (ID: {user.uid})
              <ul>
                {user.votes.map((vote) => {
                  const song = songs[vote.songId] || {};
                  return (
                    <li key={vote.id}>
                      <button
                        onClick={() =>
                          handleDeleteVote(vote.id, song.id, user.uid)
                        }
                        className="btn btn-outline-danger"
                      >
                        x
                      </button>{" "}
                      {song.artist || "Nieznany"} - {song.title || "Nieznany"} (
                      {vote.timestamp?.toDate
                        ? vote.timestamp.toDate().toLocaleString()
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
