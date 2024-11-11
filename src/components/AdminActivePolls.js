import { useState } from "react";
import {
  getPollList,
  viewPoll,
  checkPollStatus,
  togglePollStatus,
} from "../hooks/useAdminPanel";
import { useAlert } from "../context/AlertProvider";
import PollEdit from "./PollEdit";
import ActivePoll from "./ActivePoll";

const AdminActivePools = ({ records, setRecords }) => {
  const { addAlert } = useAlert();
  const [pollSongs, setPollSongs] = useState([]);
  const [editingPoll, setEditingPoll] = useState("");

  const handleUpdatePoll = async () => {
    const updatedRecords = await getPollList();
    setRecords(updatedRecords);
  };

  const handleViewPoll = async (poll) => {
    try {
      const fetchedSongs = await viewPoll(poll.id);
      setPollSongs(fetchedSongs);
      setEditingPoll(poll);
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
      <div className="d-flex flex-column gap-4">
        <div>
          <h5>Głosowanie Tygodnia:</h5>
          {records.WeeklyRecord ? (
            <ActivePoll
              poll={records.WeeklyRecord}
              handleTogglePollStatus={handleTogglePollStatus}
              handleViewPoll={handleViewPoll}
            />
          ) : (
            <p>Ładowanie głosowania tygodnia...</p>
          )}
        </div>
        <div>
          <h5>Głosowanie Miesiąca:</h5>
          {records.MonthlyRecord ? (
            <ActivePoll
              poll={records.MonthlyRecord}
              handleTogglePollStatus={handleTogglePollStatus}
              handleViewPoll={handleViewPoll}
            />
          ) : (
            <p>Ładowanie głosowania miesiąca...</p>
          )}
        </div>
        {pollSongs.length > 0 && (
          <PollEdit
            pollSongs={pollSongs}
            editingPoll={editingPoll}
            addAlert={addAlert}
            handleUpdatePoll={handleUpdatePoll}
          />
        )}
      </div>
    </div>
  );
};

export default AdminActivePools;
