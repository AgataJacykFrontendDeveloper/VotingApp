import { checkPollStatus } from "../hooks/useAdminPanel";

const ActivePoll = ({ poll, handleTogglePollStatus, handleViewPoll }) => (
  <div>
    <p>ID: {poll.id}</p>
    <p>Tytuł: {poll.title}</p>
    <p>Start: {poll.start_at.toDate().toLocaleString()}</p>
    <p>Koniec: {poll.end_at.toDate().toLocaleString()}</p>
    <p>Status: {checkPollStatus(poll) ? "Opublikowane" : "Nieopublikowane"}</p>
    <div className="d-flex flex-wrap gap-2">
      <button onClick={() => handleTogglePollStatus(poll)} className="btn-cyan">
        Zmień status publikacji
      </button>
      <button onClick={() => handleViewPoll(poll)} className="btn-cyan">
        Edytuj głosowanie tygodnia
      </button>
    </div>
  </div>
);

export default ActivePoll;
