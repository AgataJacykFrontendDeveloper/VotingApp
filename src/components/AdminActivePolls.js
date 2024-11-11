import { useState } from "react";
import {
  getPollList,
  viewPoll,
  checkPollStatus,
  togglePollStatus,
} from "../hooks/useAdminPanel";
import { useAlert } from "../context/AlertProvider";
import PollEdit from "./PollEdit";

const AdminActivePools = ({ records, setRecords }) => {
  const { addAlert } = useAlert();
  const [pollSongs, setPollSongs] = useState([]);
  const [editingPoll, setEditingPoll] = useState("");

  const handleViewPoll = async (pollId) => {
    try {
      const fetchedSongs = await viewPoll(pollId);
      setPollSongs(fetchedSongs);
      setEditingPoll(pollId);
    } catch (error) {
      console.log("Błąd podczas pobierania głosowania: ", error);
    }
  };

  const handleTogglePollStatus = async (poll) => {
    try {
      const message = await togglePollStatus(poll.id, checkPollStatus(poll));
      addAlert(message, "success");

      const updatedRecords = await getPollList();
      setRecords(updatedRecords);
    } catch (error) {
      console.log("Błąd podczas zmiany statusu publikacji: ", error);
    }
  };
  return (
    <div>
      <h2>Aktywne głosowania</h2>
      {/* TODO: Funkcjonalność do zarządzania + Jakie piosenki występują w głosowaniu */}
      <div>
        <h5>Głosowanie Tygodnia:</h5>
        {records.WeeklyRecord ? (
          <div>
            <p>ID: {records.WeeklyRecord.id}</p>
            <p>Tytuł: {records.WeeklyRecord.title}</p>
            <p>
              Start: {records.WeeklyRecord.start_at.toDate().toLocaleString()}
            </p>
            <p>
              Koniec: {records.WeeklyRecord.end_at.toDate().toLocaleString()}
            </p>
            <p>
              Status:{" "}
              {checkPollStatus(records.WeeklyRecord)
                ? "Opublikowane"
                : "Nieopublikowane"}
            </p>
            <div className="d-flex flex-wrap gap-2">
              <button
                onClick={() => handleTogglePollStatus(records.WeeklyRecord)}
                className="btn-cyan"
              >
                Zmień status publikacji
              </button>
              <button
                onClick={() => handleViewPoll(records.WeeklyRecord.id)}
                className="btn-cyan"
              >
                Edytuj głosowanie tygodnia
              </button>
            </div>
          </div>
        ) : (
          <p>Ładowanie głosowania tygodnia...</p>
        )}
      </div>
      <div>
        <h5>Głosowanie Miesiąca:</h5>
        {records.MonthlyRecord ? (
          <div>
            <p>ID: {records.MonthlyRecord.id}</p>
            <p>Tytuł: {records.MonthlyRecord.title}</p>
            <p>
              Start: {records.MonthlyRecord.start_at.toDate().toLocaleString()}
            </p>
            <p>
              Koniec: {records.MonthlyRecord.end_at.toDate().toLocaleString()}
            </p>
            <p>
              Status:{" "}
              {checkPollStatus(records.MonthlyRecord)
                ? "Opublikowane"
                : "Nieopublikowane"}
            </p>
            <button
              onClick={() => handleTogglePollStatus(records.MonthlyRecord)}
              className="btn-cyan"
            >
              Zmień status publikacji
            </button>
            <button
              onClick={() => handleViewPoll(records.MonthlyRecord.id)}
              className="btn-cyan"
            >
              Edytuj głosowanie miesiąca
            </button>
          </div>
        ) : (
          <p>Ładowanie głosowania miesiąca...</p>
        )}
      </div>
      {pollSongs.length > 0 && (
        <PollEdit
          pollSongs={pollSongs}
          editingPoll={editingPoll}
          addAlert={addAlert}
        />
      )}
    </div>
  );
};

export default AdminActivePools;
