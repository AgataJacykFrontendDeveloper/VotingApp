import { useState, useEffect } from "react";
import { updateVotes, updatePoll } from "../hooks/useAdminPanel";
import { Timestamp } from "firebase/firestore";
import Form from "react-bootstrap/Form";

const convertToISOString = (date) => {
  if (date instanceof Timestamp) {
    return date.toDate().toISOString().slice(0, 16);
  } else if (date instanceof Date) {
    return date.toISOString().slice(0, 16);
  } else {
    return new Date(date).toISOString().slice(0, 16);
  }
};

const convertToTimestamp = (date) => {
  return Timestamp.fromDate(new Date(date));
};

const PollEdit = ({ pollSongs, editingPoll, addAlert, handleUpdatePoll }) => {
  const [votes, setVotes] = useState({});
  const [pollData, setPollData] = useState({});

  useEffect(() => {
    setVotes({});
    setPollData({});
  }, [editingPoll]);

  const handleVotesChange = (songId, newVotes) => {
    if (newVotes < 0) return;
    setVotes((prevVotes) => ({
      ...prevVotes,
      [songId]: newVotes,
    }));
  };

  const handleSaveVotes = async () => {
    try {
      if (Object.keys(pollData).length > 0) {
        if (pollData.start_at) {
          pollData.start_at = convertToTimestamp(pollData.start_at);
        }
        if (pollData.end_at) {
          pollData.end_at = convertToTimestamp(pollData.end_at);
        }

        const message = await updatePoll(editingPoll.id, pollData);
        handleUpdatePoll();
        addAlert(message, "success");
      }
      for (const [songId, newVotes] of Object.entries(votes)) {
        const message = await updateVotes(editingPoll.id, songId, newVotes);
        addAlert(message, "success");
      }
    } catch (error) {
      addAlert(error.message, "error");
    }
  };

  return (
    <div>
      <h5>Edycja głosowania (ID: {editingPoll.id}):</h5>
      <Form
        noValidate
        className="d-flex flex-column gap-2 container-sm container m-0"
      >
        <Form.Group>
          <Form.Label htmlFor="title">Nazwa</Form.Label>
          <Form.Control
            value={pollData.title || editingPoll.title}
            onChange={(e) =>
              setPollData({ ...pollData, title: e.target.value })
            }
            type="text"
            id="title"
            name="title"
            required
          />
          <Form.Control.Feedback type="invalid">
            Proszę podaj nazwe głosowania.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="type">Typ głosowania</Form.Label>
          <Form.Select
            value={pollData.type || editingPoll.type}
            onChange={(e) => setPollData({ ...pollData, type: e.target.value })}
            name="type"
            id="type"
            required
          >
            <option value="" disabled hidden>
              Wybierz typ głosowania
            </option>
            <option value="weekly">Tygodnia</option>
            <option value="monthly">Miesiąca</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Proszę podaj typ głosowania.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="start_at">Data rozpoczęcia</Form.Label>
          <Form.Control
            value={
              pollData.start_at || convertToISOString(editingPoll.start_at)
            }
            onChange={(e) =>
              setPollData({ ...pollData, start_at: e.target.value })
            }
            type="datetime-local"
            id="start_at"
            name="start_at"
            required
          />
          <Form.Control.Feedback type="invalid">
            Proszę prawidłową date rozpoczęcia głosowania.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label htmlFor="end_at">Data zakończenia</Form.Label>
          <Form.Control
            value={pollData.end_at || convertToISOString(editingPoll.end_at)}
            onChange={(e) =>
              setPollData({ ...pollData, end_at: e.target.value })
            }
            type="datetime-local"
            id="end_at"
            name="end_at"
            required
          />
          <Form.Control.Feedback type="invalid">
            Proszę prawidłową date zakończenia głosowania.
          </Form.Control.Feedback>
        </Form.Group>
      </Form>
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
