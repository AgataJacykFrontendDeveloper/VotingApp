import { useState, useEffect } from "react";
import {
  getPollList,
  viewPoll,
  checkPollStatus,
  togglePollStatus,
  toggleAnonymousVoting,
} from "../hooks/useAdminPanel";
import { useAlert } from "../context/AlertProvider";
import PollEdit from "./PollEdit";
import ActivePoll from "./ActivePoll";

const AdminActivePolls = ({ records, setRecords }) => {
  const { addAlert } = useAlert();
  const [pollSongs, setPollSongs] = useState([]);
  const [editingPoll, setEditingPoll] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const updatedRecords = await getPollList();
        setRecords(updatedRecords);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };
    fetchRecords();
  }, [setRecords]);

  const handleUpdatePoll = async () => {
    try {
      const updatedRecords = await getPollList();
      setRecords(updatedRecords);
    } catch (error) {
      console.error("Error updating poll records:", error);
    }
  };

  const handleViewPoll = async (poll) => {
    try {
      const fetchedSongs = await viewPoll(poll.id);
      setPollSongs(fetchedSongs);
      setEditingPoll(poll);
    } catch (error) {
      console.error("Error viewing poll:", error);
    }
  };

  const handleTogglePollStatus = async (poll) => {
    try {
      let message = await togglePollStatus(poll.id, checkPollStatus(poll));
      addAlert(message, "success");

      const updatedRecords = await getPollList();
      setRecords(updatedRecords);
    } catch (error) {
      console.error("Error toggling poll status:", error);
    }
  };

  const handleTogglePollAnonymity = async (poll) => {
    try {
      const message = await toggleAnonymousVoting(
        poll.id,
        poll.anonymousVoting
      );
      addAlert(message, "success");

      const updatedRecords = await getPollList();
      setRecords(updatedRecords);
    } catch (error) {
      console.error("Error toggling poll anonymity:", error);
    }
  };

  useEffect(() => {
    console.log("Records: ", records);
  }, [records]);

  const weeklyPoll =
    records?.WeeklyRecord && records.WeeklyRecord.published
      ? records.WeeklyRecord
      : null;
  const monthlyPoll =
    records?.MonthlyRecord && records.MonthlyRecord.published
      ? records.MonthlyRecord
      : null;

  return (
    <div>
      <h2>Aktywne głosowania</h2>
      <div className="d-flex flex-column gap-4">
        <div>
          <h5>Głosowanie Tygodnia:</h5>
          {weeklyPoll ? (
            <ActivePoll
              poll={weeklyPoll}
              handleTogglePollStatus={handleTogglePollStatus}
              handleViewPoll={handleViewPoll}
              handleTogglePollAnonymity={handleTogglePollAnonymity}
            />
          ) : (
            <p>Brak aktywnego głosowania na ten tydzień.</p>
          )}
        </div>
        <div>
          <h5>Głosowanie Miesiąca:</h5>
          {monthlyPoll ? (
            <ActivePoll
              poll={monthlyPoll}
              handleTogglePollStatus={handleTogglePollStatus}
              handleViewPoll={handleViewPoll}
              handleTogglePollAnonymity={handleTogglePollAnonymity}
            />
          ) : (
            <p>Brak aktywnego głosowania na ten miesiąc.</p>
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

export default AdminActivePolls;
