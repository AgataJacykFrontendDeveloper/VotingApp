import AlertContext from "../context/AlertProvider";
import { useContext } from "react";
import { deleteVote } from "../hooks/useAdminPanel";

const VotesDisplay = ({ votes, setVotes }) => {
  const { addAlert } = useContext(AlertContext);

  const handleDeleteVote = async (pollId, songId, uid) => {
    try {
      await deleteVote(pollId, songId, uid);
      setVotes((prevVotes) =>
        prevVotes.map((vote) =>
          vote.songId === songId
            ? {
                ...vote,
                usersVoted: vote.usersVoted.filter(
                  (user) => user.userId !== uid
                ),
                songVotes: vote.songVotes - 1,
              }
            : vote
        )
      );
      return addAlert("Głos został usunięty.");
    } catch (error) {
      console.error("Nie udało się usunąć głosu: ", error);
    }
  };

  return (
    <div>
      <h4>Głosy:</h4>
      <ul>
        {votes.map((vote, index) => (
          <li key={index}>
            <strong>
              {vote.songArtist} - {vote.songTitle} (Całkowita liczba głosów:{" "}
              {vote.songVotes})
            </strong>
            <ul>
              {Array.isArray(vote.usersVoted) && vote.usersVoted.length > 0 ? (
                vote.usersVoted.map((user, userIndex) => (
                  <li key={userIndex}>
                    <button
                      onClick={() =>
                        handleDeleteVote(vote.pollId, vote.songId, user.userId)
                      }
                      className="btn btn-outline-danger"
                    >
                      x
                    </button>{" "}
                    {user.userEmail} ({user.userTimeStamp})
                  </li>
                ))
              ) : (
                <li>Brak głosów na ten utwór.</li>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VotesDisplay;
