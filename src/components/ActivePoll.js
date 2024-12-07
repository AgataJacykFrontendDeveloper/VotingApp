import { checkPollStatus } from "../hooks/useAdminPanel";

const ActivePoll = ({
  poll,
  handleTogglePollStatus,
  handleViewPoll,
  handleToggleAnonymousVoting,
  handleShowVotes,
}) => (
  <div>
    <p>ID: {poll.id}</p>
    <p>Tytuł: {poll.title}</p>
    <p>Start: {poll.start_at.toDate().toLocaleString()}</p>
    <p>Koniec: {poll.end_at.toDate().toLocaleString()}</p>
    <p>Status: {checkPollStatus(poll) ? "Opublikowane" : "Nieopublikowane"}</p>
    <p>
      Głosowanie anonimowe: {poll.anonymousVoting ? "Włączone" : "Wyłączone"}
    </p>
    <div className="d-flex flex-wrap gap-2">
      <button onClick={() => handleViewPoll(poll)} className="btn-cyan">
        Edytuj głosowanie
      </button>
      <button onClick={() => handleTogglePollStatus(poll)} className="btn-cyan">
        Zmień status publikacji
      </button>
      <button
        onClick={() => handleToggleAnonymousVoting(poll)}
        className="btn-cyan"
      >
        {poll.anonymousVoting
          ? "Wyłącz anonimowe głosowanie"
          : "Włącz anonimowe głosowanie"}
      </button>
      <button onClick={() => handleShowVotes(poll)} className="btn-cyan">
        Wyświetl głosy
      </button>
    </div>
  </div>
);

export default ActivePoll;
