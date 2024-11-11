import { useState } from "react";
import { updateVotes } from "../hooks/useAdminPanel";

const PollEdit = ({ pollSongs, editingPoll, addAlert }) => {
  const [votes, setVotes] = useState({});

  const handleVotesChange = (songId, newVotes) => {
    if (newVotes < 0) return;
    setVotes((prevVotes) => ({
      ...prevVotes,
      [songId]: newVotes,
    }));
  };

  const handleSaveVotes = async () => {
    try {
      for (const [songId, newVotes] of Object.entries(votes)) {
        const message = await updateVotes(editingPoll, songId, newVotes);
        addAlert(message, "success");
      }
    } catch (error) {
      addAlert(error.message, "error");
    }
  };

  return (
    <div>
      <h5>Edycja głosowania (ID: {editingPoll}):</h5>
      <ul>
        {pollSongs.map((song) => (
          <li key={song.id}>
            [{song.data.genre}] {song.data.artist} - {song.data.title} (ID
            utworu: {song.id}) | Głosy:
            <input
              type="number"
              min="0"
              value={
                votes[song.id] !== undefined ? votes[song.id] : song.data.votes
              }
              onChange={(e) =>
                handleVotesChange(song.id, Number(e.target.value))
              }
            />
          </li>
        ))}
      </ul>
      <button onClick={handleSaveVotes} className="btn-cyan">
        Zapisz
      </button>
    </div>
  );
};

export default PollEdit;
